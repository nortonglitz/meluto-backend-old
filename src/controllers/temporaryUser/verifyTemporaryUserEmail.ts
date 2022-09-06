import { RequestHandler } from 'express'
import { EmailCode, TemporaryUser } from 'models'

export const verifyTemporaryUserEmail: RequestHandler = async (req, res, next) => {
  const { code, email: bodyEmail } = req.body

  const email = (bodyEmail as string).toLowerCase()

  try {
    const emailCode = await EmailCode.findOne({ email })
    if (!emailCode) {
      return res.status(404).json({
        error: 'NoCodeError',
        message: 'no code generated for this email.'
      })
    }

    const { code: verifyCode } = emailCode

    if (verifyCode !== code) {
      return res.status(400).json({
        error: 'InvalidCodeError',
        message: 'code does not match.'
      })
    }

    const temporaryUser = await TemporaryUser.findOne({ 'email.value': email })
    if (!temporaryUser) {
      return res.status(404).json({
        error: 'InvalidEmailError',
        message: 'can not find user.'
      })
    }

    const verifiedUser = await TemporaryUser.findByIdAndUpdate(temporaryUser.id, { 'email.verified': true }, { new: true })

    if (!verifiedUser) {
      return res.status(500).json({
        error: 'UpdateUserError',
        message: 'can not update user.'
      })
    }

    await emailCode.delete()
    const { password: _deletePassword, __v, ...temporaryUserInfo } = verifiedUser.toObject()

    return res.status(200).json({
      temporaryUser: temporaryUserInfo
    })
  } catch (err: any) {
    next(err)
  }
}
