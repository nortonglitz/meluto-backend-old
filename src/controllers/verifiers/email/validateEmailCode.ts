import { RequestHandler } from 'express'
import { EmailVerifier } from 'models'
import { verifiedFieldCookie } from 'config/cookie'
import { issueFieldToken } from 'utils/jwt'
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

    const verifiedEmailToken = await issueFieldToken(emailVerificationExists.id)

    return res
      .status(200)
      .cookie(verifiedFieldCookie.verifiedEmailTokenName, verifiedEmailToken, {
        sameSite: verifiedFieldCookie.sameSite,
        maxAge: verifiedFieldCookie.maxAge,
        httpOnly: verifiedFieldCookie.httpOnly,
        secure: verifiedFieldCookie.secure
      })
      .json({
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
