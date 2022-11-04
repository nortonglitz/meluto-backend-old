import { RequestHandler } from 'express'
import { User, PhoneVerifier } from 'models'
import { randomNumber } from 'utils/random'
import { validatePhone } from 'utils/formValidation'

export const sendPhoneCode: RequestHandler = async (req, res, next) => {
  try {
    const phone = req.body.phone as string

    validatePhone({ phone })

    const userExists = await User.findOne({ phone })

    if (userExists) {
      return res.status(400).json({
        error: 'DuplicatePhoneError',
        message: 'phone already exists.'
      })
    }

    const phoneVerificationExists = await PhoneVerifier.findOne({ phone })

    if (phoneVerificationExists) {
      phoneVerificationExists.code = randomNumber(6)
      await phoneVerificationExists.save()
    } else {
      await PhoneVerifier.create({
        code: randomNumber(6),
        phone
      })
    }

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