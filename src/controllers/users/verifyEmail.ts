import { RequestHandler } from 'express'
import { EmailCode, User } from 'models'

export const verifyEmail: RequestHandler = async (req, res, next) => {
  const { code, email } = req.body

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

    const user = await User.findOne({ 'email.value': email })
    if (!user) {
      return res.status(404).json({
        error: 'InvalidEmailError',
        message: 'can not find user.'
      })
    }

    const verifiedUser = await User.findByIdAndUpdate(user.id, { 'email.verified': true }, { new: true })

    if (!verifiedUser) {
      return res.status(500).json({
        error: 'UpdateUserError',
        message: 'can not update user.'
      })
    }

    await emailCode.delete()
    const { password: _deletePassword, __v, ...userInfo } = verifiedUser.toObject()

    return res.status(200).json({
      user: {
        ...userInfo,
        password: { updatedAt: _deletePassword.updatedAt }
      }
    })
  } catch (err: any) {
    next(err)
  }
}
