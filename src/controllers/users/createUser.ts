import { randomString } from 'utils/random'
import { verifyFieldJwt } from 'utils/jwt'
import { User, EmailVerifier, PhoneVerifier } from 'models'
import { validateCreateUser } from 'utils/formValidation'
import { RequestHandler } from 'express'
import { saltHashPassword } from 'utils/cryptography'
import { JwtPayload } from 'jsonwebtoken'

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { vp, ve } = req.cookies
    const { name, password } = req.body

    if (!vp || !ve) {
      return res.status(400).json({
        error: 'EmailOrPhoneNotVerifiedError',
        message: 'phone or email not verified.'
      })
    }

    const { sub: phoneVerificationId } = await verifyFieldJwt(vp) as JwtPayload
    const { sub: emailVerificationId } = await verifyFieldJwt(ve) as JwtPayload

    if (typeof phoneVerificationId !== 'string' || typeof emailVerificationId !== 'string') {
      return res.status(400).json({
        error: 'EmailOrPhoneNotValidError',
        message: 'phone or email not valid.'
      })
    }
    const phoneVerification = await PhoneVerifier.findById(phoneVerificationId)

    if (!phoneVerification) {
      return res.status(400).json({
        error: 'PhoneVerifierError',
        message: 'phone not found.'
      })
    }

    if (!phoneVerification.verified) {
      return res.status(400).json({
        error: 'PhoneNotVerifiedError',
        message: 'phone is not verified.'
      })
    }

    const phone = phoneVerification.phone

    const emailVerification = await EmailVerifier.findById(emailVerificationId)

    if (!emailVerification) {
      return res.status(400).json({
        error: 'EmailVerifierError',
        message: 'e-mail not found.'
      })
    }

    if (!emailVerification.verified) {
      return res.status(400).json({
        error: 'EmailNotVerifiedError',
        message: 'e-mail is not verified.'
      })
    }

    const email = emailVerification.email

    validateCreateUser({ email, name, password, phone })

    const newUser = await User.create({
      username: {
        value: randomString(12)
      },
      password: {
        value: await saltHashPassword(password)
      },
      names: {
        first: name
      },
      email: {
        value: email,
        verified: true
      },
      phone: {
        value: phone,
        verified: true
      }
    })

    const { password: _deletePassword, __v, ...userInfo } = newUser.toObject()

    return res.status(200)
      .clearCookie('ve')
      .clearCookie('vp')
      .json({
        user: {
          ...userInfo,
          password: { updatedAt: _deletePassword.updatedAt }
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
