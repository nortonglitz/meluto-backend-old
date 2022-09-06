import { RequestHandler } from 'express'

export const emailVerified: RequestHandler = async (req, res, next) => {
  const user = req.user

  if (!user.email.verified) {
    return res.status(401).json({
      error: 'UnverifiedEmailError',
      message: 'email not verified.'
    })
  }

  return next()
}
