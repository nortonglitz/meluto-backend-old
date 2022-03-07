import { RequestHandler } from 'express'
import { User } from 'models'
import { validateCredentials } from 'utils/formValidation/schemas/auth/checkCredentials'

export const checkCredentials: RequestHandler = async (req, res, next) => {
  const password = req.body.password
  const username = req.body.username
  const email = req.body.email

  let userExists = null

  try {
    validateCredentials({ password, username, email })

    if ((email && username) || (email && !username)) {
      userExists = await User.findOne({ email })
    } else {
      userExists = await User.findOne({ 'username.value': username })
    }

    if (!userExists) {
      return res.status(400).json({
        error: 'InvalidUserError',
        message: 'user is not available'
      })
    }

    return next()
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
