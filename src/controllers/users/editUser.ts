import { User } from 'models'
import { RequestHandler } from 'express'
import { isValidObjectId } from 'mongoose'
import { saltHashPassword } from 'utils/cryptography'
import { validateName, validateEmail, validatePassword, validateUsername, validateTradingName, validateDescription } from 'utils/formValidation'
import { differenceInDays } from 'date-fns'
import { isSameDate } from 'utils/dateHandler'

const DAYS_TO_EDIT_NAME = 60
const DAYS_TO_EDIT_USERNAME = 60

export const editUser: RequestHandler = async (req, res, next) => {
  const changeUserId = req.params.userId as any
  const user = req.user
  const field = req.params.field

  const isProfessional = req.user.role === 'professional'

  const {
    firstName, lastName, email,
    newPassword, confirmNewPassword, username,
    tradingName, description
  } = req.body

  if (!changeUserId || !isValidObjectId(changeUserId)) {
    return res.status(400).json({
      error: 'InvalidIdError',
      message: 'can not use this id'
    })
  }

  if (user.id !== changeUserId && user.role !== 'admin') {
    return res.status(401).json({
      error: 'AuthenticationError',
      message: 'you are not allowed to do that'
    })
  }

  try {
    let modifiedUser = null

    if (field === 'email') {
      validateEmail(email)

      const userEmailExists = await User.findOne({ 'email.value': email })

      if (userEmailExists) {
        return res.status(409).json({
          error: 'DuplicateEmailError',
          message: 'email in use'
        })
      }
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { 'email.value': email }, { new: true })
    }

    if (field === 'name' && user.names.first && user.names.last) {
      if (!isSameDate(user.createdAt, user.names.updatedAt)) {
        const pastDays = differenceInDays(new Date(), user.names.updatedAt)
        if (pastDays < DAYS_TO_EDIT_NAME) {
          return res.status(400).json({
            error: 'DateBlockError',
            message: `must wait ${DAYS_TO_EDIT_NAME - pastDays} ${(DAYS_TO_EDIT_NAME - pastDays) < 2 ? 'day' : 'days'} to edit name`
          })
        }
      }
      if (user.names.first === firstName && user.names.last === lastName) {
        return res.status(409).json({
          error: 'SameNameError',
          message: 'can not modify name'
        })
      }
      validateName({ firstName, lastName })
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { 'names.first': firstName, 'names.last': lastName }, { new: true })
    }

    if (field === 'tradingName' && user.names.trading) {
      if (!isSameDate(user.createdAt, user.names.updatedAt)) {
        const pastDays = differenceInDays(new Date(), user.names.updatedAt)
        if (pastDays < DAYS_TO_EDIT_NAME) {
          return res.status(400).json({
            error: 'DateBlockError',
            message: `must wait ${DAYS_TO_EDIT_NAME - pastDays} ${(DAYS_TO_EDIT_NAME - pastDays) < 2 ? 'day' : 'days'} to edit name`
          })
        }
      }
      if (user.names.trading === tradingName) {
        return res.status(409).json({
          error: 'SameNameError',
          message: 'can not modify name'
        })
      }
      validateTradingName({ tradingName })
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { 'names.trading': tradingName }, { new: true })
    }

    if (field === 'password') {
      validatePassword(newPassword, confirmNewPassword)
      modifiedUser = await User.findByIdAndUpdate(changeUserId,
        { 'password.value': await saltHashPassword(newPassword) },
        { new: true }
      )
    }

    if (field === 'description') {
      validateDescription({ description })
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { description }, { new: true })
    }

    if (field === 'username' && isProfessional) {
      if (!isSameDate(user.createdAt, user.username.updatedAt)) {
        const pastDays = differenceInDays(new Date(), user.username.updatedAt)
        if (pastDays < DAYS_TO_EDIT_USERNAME) {
          return res.status(400).json({
            error: 'DateBlockError',
            message: `must wait ${DAYS_TO_EDIT_USERNAME - pastDays} ${(DAYS_TO_EDIT_USERNAME - pastDays) < 2 ? 'day' : 'days'} to edit username`
          })
        }
      }
      if (username === user.username.value) {
        return res.status(400).json({
          error: 'SameUsernameError',
          message: 'can not modify username'
        })
      }
      validateUsername(username)

      const userUsernameExists = await User.findOne({ 'username.value': username })

      if (userUsernameExists) {
        return res.status(409).json({
          error: 'DuplicateUsernameError',
          message: 'username in use'
        })
      }
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { 'username.value': username }, { new: true })
    }

    if (!isProfessional && !modifiedUser) {
      return res.status(400).json({
        error: 'InvalidRoleError',
        message: 'can not edit this field'
      })
    }

    if (!modifiedUser) {
      return res.status(400).json({
        error: 'InvalidFieldError',
        message: 'can not modify user'
      })
    }

    const { password: _deletePassword, __v, ...userInfo } = modifiedUser.toObject()

    return res.status(200).json({
      user: {
        ...userInfo,
        password: { updatedAt: _deletePassword.updatedAt }
      }
    })
  } catch (err: any) {
    if (err.name.includes('ValidationError')) {
      return res.status(400).json({
        error: err.name,
        path: err.stack,
        message: err.message
      })
    }
    next(err)
  }
}
