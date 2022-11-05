import { RequestHandler } from 'express'
import { User, EmailVerifier } from 'models'
import { randomNumber } from 'utils/random'
import { validateEmail } from 'utils/formValidation'

export const sendEmailCode: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase() as string

    validateEmail(email)

    const userExists = await User.findOne({ 'email.value': email })

    if (userExists) {
      return res.status(400).json({
        error: 'DuplicateEmailError',
        message: 'e-mail already in use.'
      })
    }

    const emailVerificationExists = await EmailVerifier.findOne({ email })

    if (!emailVerificationExists) {
      await EmailVerifier.create({
        code: randomNumber(6),
        email
      })
      return res.status(201).json({
        message: 'code generated.'
      })
    }

    if (emailVerificationExists.verified) {
      emailVerificationExists.verified = false
    }

    emailVerificationExists.code = randomNumber(6)
    await emailVerificationExists.save()

    return res.status(201).json({
      message: 'code generated.'
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
