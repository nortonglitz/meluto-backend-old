import { RequestHandler } from 'express'
import { randomNumber } from 'utils/random'
import { TemporaryUser, User, EmailCode } from 'models'
import { validateCreateTemporaryUser } from 'utils/formValidation'

export const createTemporaryUser: RequestHandler = async (req, res, next) => {
  const { email: bodyEmail, role } = req.body

  const email = (bodyEmail as string).toLowerCase()

  try {
    validateCreateTemporaryUser({ email, role })

    const temporaryUserExists = await TemporaryUser.findOne({ 'email.value': email })

    if (temporaryUserExists) {
      const { password: _deletePassword, __v, ...temporaryUserInfo } = temporaryUserExists.toObject()
      return res.status(200).json({
        temporaryUser: {
          ...temporaryUserInfo,
          password: !!_deletePassword
        }
      })
    }

    const userExists = await User.findOne({ 'email.value': email })

    if (userExists) {
      return res.status(409).json({
        error: 'DuplicateEmailError',
        message: 'can not use that email'
      })
    }

    const temporaryUser = await TemporaryUser.create({
      'email.value': email,
      role
    })

    if (!temporaryUser) {
      return res.status(400).json({
        error: 'InvalidDataError',
        message: 'could not create temporary user.'
      })
    }

    const emailCodeExists = await EmailCode.findOne({ email })

    if (emailCodeExists) {
      await emailCodeExists.delete()
    }

    await EmailCode.create({
      email,
      code: randomNumber(6)
    })

    return res.status(201).json({ temporaryUser: temporaryUser })
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
