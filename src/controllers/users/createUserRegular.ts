import { isValidObjectId } from 'mongoose'
import { randomString } from 'utils/random'
import { User, TemporaryUser } from 'models'
import { RequestHandler } from 'express'
import { validateCreateRegular } from 'utils/formValidation'

export const createUserRegular: RequestHandler = async (req, res, next) => {
  const { temporaryUserId } = req.body

  try {
    if (!temporaryUserId || !isValidObjectId(temporaryUserId)) {
      return res.status(400).json({
        error: 'InvalidIdError',
        message: 'can not use this id'
      })
    }

    const temporaryUserExists = await TemporaryUser.findById(temporaryUserId)

    if (!temporaryUserExists) {
      return res.status(409).json({
        error: 'TemporaryUserNotFoundError',
        message: 'can not find user'
      })
    }

    const {
      email,
      names: {
        first: firstName,
        last: lastName
      },
      role,
      password
    } = temporaryUserExists

    if (role === 'professional') {
      return res.status(409).json({
        error: 'InvalidRoleError',
        message: 'can create that user'
      })
    }

    const userExists = await User.findOne({ 'email.value': email.value })

    if (userExists) {
      return res.status(409).json({
        error: 'DuplicateEmailError',
        message: 'can not use that email'
      })
    }

    validateCreateRegular({
      role,
      email: email.value,
      firstName,
      lastName
    })

    const newUser = await User.create({
      role,
      username: {
        value: randomString(14)
      },
      names: {
        first: firstName,
        last: lastName
      },
      email,
      password: {
        value: password
      },
      taxInfo: 'individual'
    })

    if (!newUser) {
      return res.status(500).json({
        error: 'CreationError',
        message: 'something went wrong during the creation'
      })
    }

    await TemporaryUser.findByIdAndDelete(temporaryUserId)

    const { password: _deletePassword, __v, ...userInfo } = newUser

    return res.status(201).json({
      user: { ...userInfo }
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
