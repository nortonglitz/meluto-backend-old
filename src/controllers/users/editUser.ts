import { User } from 'models'
import { RequestHandler } from 'express'
import { isValidObjectId } from 'mongoose'
import { saltHashPassword, checkPassword } from 'utils/cryptography'
import { validateName, validateEmail, validatePassword, validateUsername } from 'utils/formValidation'
import { differenceInDays } from 'date-fns'

const DAYS_TO_EDIT_NAME = 30
const DAYS_TO_EDIT_USERNAME = 30

export const editUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId
  const field = req.params.field

  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password
  const username = req.body.username

  try {
    let modifiedUser = null

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({
        error: 'InvalidIdError',
        message: 'can not use this id'
      })
    }

    const userExists = await User.findById(userId)

    if (!userExists) {
      return res.status(400).json({
        error: 'InvalidUserError',
        message: 'user does not exists'
      })
    }

    if (field === 'email') {
      validateEmail(email)

      const userEmailExists = await User.findOne({ email })

      if (userEmailExists) {
        return res.status(409).json({
          error: 'DuplicateEmailError',
          message: 'email in use'
        })
      }
      modifiedUser = await User.findByIdAndUpdate(userId, { email }, { new: true })
    }

    if (field === 'name') {
      const pastDays = differenceInDays(new Date(), userExists.name.updatedAt)
      if (pastDays < DAYS_TO_EDIT_NAME) {
        return res.status(400).json({
          error: 'DateBlockError',
          message: `must wait ${DAYS_TO_EDIT_NAME - pastDays} ${(DAYS_TO_EDIT_NAME - pastDays) < 2 ? 'day' : 'days'} to edit name`
        })
      }
      if (userExists.name.first === firstName && userExists.name.last === lastName) {
        return res.status(409).json({
          error: 'SameNameError',
          message: 'can not modify name'
        })
      }
      validateName({ firstName, lastName })
      modifiedUser = await User.findByIdAndUpdate(userId, { name: { first: firstName, last: lastName } }, { new: true })
    }

    if (field === 'password') {
      if (await checkPassword(password, userExists.password.value)) {
        return res.status(409).json({
          error: 'InvalidPasswordError',
          message: 'can not modify password'
        })
      }
      validatePassword(password)
      modifiedUser = await User.findByIdAndUpdate(userId,
        { password: { value: await saltHashPassword(password) } },
        { new: true }
      )
    }

    if (field === 'username') {
      const pastDays = differenceInDays(new Date(), userExists.username.updatedAt)
      if (pastDays < DAYS_TO_EDIT_USERNAME) {
        return res.status(400).json({
          error: 'DateBlockError',
          message: `must wait ${DAYS_TO_EDIT_USERNAME - pastDays} ${(DAYS_TO_EDIT_USERNAME - pastDays) < 2 ? 'day' : 'days'} to edit username`
        })
      }

      if (username === userExists.username.value) {
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
      modifiedUser = await User.findByIdAndUpdate(userId, { username: { value: username } }, { new: true })
    }

    if (!modifiedUser) {
      return res.status(400).json({
        error: 'InvalidFieldError',
        message: 'can not modify user'
      })
    }

    return res.status(200).json(modifiedUser)
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
