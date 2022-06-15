import { RequestHandler } from 'express'
import { sessionCookie } from 'config/cookie'

export const endSession: RequestHandler = async (req, res, next) => {
  try {
    return res.status(200)
      .clearCookie(sessionCookie.accessTokenName)
      .clearCookie(sessionCookie.refreshTokenName)
      .json({
        message: 'user logged out.'
      })
  } catch (err: any) {
    next(err)
  }
}
