import { RequestHandler } from 'express'
import { EmailCode, User } from 'models'
import { randomNumber } from 'utils/random'

export const sendEmailCode: RequestHandler = async (req, res, next) => {
  const { email } = req.body
  try {
    const userExists = await User.findOne({ 'email.value': email })

    if (!userExists) {
      return res.status(400).json({
        error: 'InvalidUserError',
        message: 'can not find user.'
      })
    }

    const codeExists = await EmailCode.findOne({ email })

    if (codeExists) {
      await codeExists.delete()
    }

    const newCode = await EmailCode.create({ email, code: randomNumber(6) })

    if (!newCode) {
      return res.status(500).json({
        error: 'GenerateCodeError',
        message: 'could not generate code.'
      })
    }

    return res.status(201).json({
      message: 'code generated.'
    })
  } catch (err: any) {
    next(err)
  }
}
