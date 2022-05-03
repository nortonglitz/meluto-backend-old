import { User } from 'models'
import { RequestHandler } from 'express'
import { isValidObjectId } from 'mongoose'
import { saltHashPassword } from 'utils/cryptography'
import { validateName, validateEmail, validatePassword, validateUsername } from 'utils/formValidation'
import { differenceInDays } from 'date-fns'

const DAYS_TO_EDIT_NAME = 30
const DAYS_TO_EDIT_USERNAME = 30

export const editUser: RequestHandler = async (req, res, next) => {
  const changeUserId = req.params.userId
  const user = req.user
  const field = req.params.field

  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const newPassword = req.body.newPassword
  const confirmNewPassword = req.body.confirmNewPassword
  const username = req.body.username

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

      const userEmailExists = await User.findOne({ email })

      if (userEmailExists) {
        return res.status(409).json({
          error: 'DuplicateEmailError',
          message: 'email in use'
        })
      }
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { email }, { new: true })
    }

    if (field === 'name') {
      const pastDays = differenceInDays(new Date(), user.name.updatedAt)
      if (pastDays < DAYS_TO_EDIT_NAME) {
        return res.status(400).json({
          error: 'DateBlockError',
          message: `must wait ${DAYS_TO_EDIT_NAME - pastDays} ${(DAYS_TO_EDIT_NAME - pastDays) < 2 ? 'day' : 'days'} to edit name`
        })
      }
      if (user.name.first === firstName && user.name.last === lastName) {
        return res.status(409).json({
          error: 'SameNameError',
          message: 'can not modify name'
        })
      }
      validateName({ firstName, lastName })
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { name: { first: firstName, last: lastName } }, { new: true })
    }

    if (field === 'password') {
      validatePassword(newPassword, confirmNewPassword)
      modifiedUser = await User.findByIdAndUpdate(changeUserId,
        { password: { value: await saltHashPassword(newPassword) } },
        { new: true }
      )
    }

    if (field === 'username') {
      const pastDays = differenceInDays(new Date(), user.username.updatedAt)
      if (pastDays < DAYS_TO_EDIT_USERNAME) {
        return res.status(400).json({
          error: 'DateBlockError',
          message: `must wait ${DAYS_TO_EDIT_USERNAME - pastDays} ${(DAYS_TO_EDIT_USERNAME - pastDays) < 2 ? 'day' : 'days'} to edit username`
        })
      }

      if (username === user.username.value) {
        return res.status(400).json({
          error: 'SameUsernameError',
          message: 'can not modify username'
        })
      }
      validateUsername(username)

      const userUsernameExists = await User.findOne({ username: { value: username } })

      if (userUsernameExists) {
        return res.status(409).json({
          error: 'DuplicateUsernameError',
          message: 'username in use'
        })
      }
      modifiedUser = await User.findByIdAndUpdate(changeUserId, { username: { value: username } }, { new: true })
    }

    if (!modifiedUser) {
      return res.status(400).json({
        error: 'InvalidFieldError',
        message: 'can not modify user'
      })
    }

    return res.status(200).json({
      message: 'user updated'
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
