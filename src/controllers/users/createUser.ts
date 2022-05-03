import { randomString } from 'utils/random'
import { RequestHandler } from 'express'
import { User } from 'models'
import { saltHashPassword } from 'utils/cryptography'
import { validateCreateUser } from 'utils/formValidation'

export const createUser: RequestHandler = async (req, res, next) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password

  try {
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(409).json({
        error: 'DuplicateEmailError',
        message: 'Email already in use.'
      })
    }

    validateCreateUser({
      firstName: firstName,
      lastName: lastName,
      email,
      password
    })

    const newUser = await User.create({
      username: {
        value: randomString(12)
      },
      name: {
        first: firstName,
        last: lastName
      },
      email,
      password: {
        value: await saltHashPassword(password)
      }
    })

    const { password: _deletePassword, __v, ...userInfo } = newUser.toObject()

    return res.status(200).json({
      message: 'User created',
      user: {
        ...userInfo
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
