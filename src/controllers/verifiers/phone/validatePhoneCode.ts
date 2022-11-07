import { RequestHandler } from 'express'
import { PhoneVerifier } from 'models'
import { issueFieldToken } from 'utils/jwt'
import { verifiedFieldCookie } from 'config/cookie'
import { validateValidatePhone } from 'utils/formValidation'

type ValidatePhoneParams = {
  code: string
  phone: string
}

export const validatePhoneCode: RequestHandler = async (req, res, next) => {
  try {
    const { code, phone }: ValidatePhoneParams = req.body

    validateValidatePhone({ code, phone })

    const phoneVerificationExists = await PhoneVerifier.findOne({ phone })

    if (!phoneVerificationExists) {
      return res.status(400).json({
        error: 'InvalidPhoneError',
        message: 'this phone is not being verified.'
      })
    }

    if (phoneVerificationExists.code !== code) {
      return res.status(400).json({
        error: 'InvalidCodeError',
        message: 'this code is not valid.'
      })
    }

    phoneVerificationExists.verified = true
    await phoneVerificationExists.save()

    const verifiedPhoneToken = await issueFieldToken(phoneVerificationExists.id)

    return res
      .status(200)
      .cookie(verifiedFieldCookie.verifiedPhoneTokenName, verifiedPhoneToken, {
        sameSite: verifiedFieldCookie.sameSite,
        maxAge: verifiedFieldCookie.maxAge,
        httpOnly: verifiedFieldCookie.httpOnly
      })
      .json({
        message: 'phone successful validated.'
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
