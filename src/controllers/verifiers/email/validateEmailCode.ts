import { RequestHandler } from 'express'
import { EmailVerifier } from 'models'
import { validateValidateEmail } from 'utils/formValidation'

type ValidateEmailParams = {
  code: string
  email: string
}

export const validateEmailCode: RequestHandler = async (req, res, next) => {
  try {
    const { code, email }: ValidateEmailParams = req.body

    validateValidateEmail({ code, email })

    const emailVerificationExists = await EmailVerifier.findOne({ email })

    if (!emailVerificationExists) {
      return res.status(400).json({
        error: 'InvalidEmailError',
        message: 'this e-mail is not being verified.'
      })
    }

    if (emailVerificationExists.code !== code) {
      return res.status(400).json({
        error: 'InvalidCodeError',
        message: 'this code is not valid.'
      })
    }

    emailVerificationExists.verified = true
    await emailVerificationExists.save()

    return res.status(200).json({
      message: 'e-mail successful validated.'
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