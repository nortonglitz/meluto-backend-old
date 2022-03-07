import { isValidObjectId, Types } from 'mongoose'
import { parseUserAgent } from 'utils/devideDetector'
import { issueJwt } from 'utils/jwt'
import { RequestHandler } from 'express'
import { Session } from 'models'
import { sessionCookie } from 'config/cookie'

export const createSession: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId
  const userAgent = req.headers['user-agent']
  const user = req.user

  try {
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({
        error: 'InvalidIdError',
        message: 'can not use this id'
      })
    }

    /* if (user.id !== req.params.userId) {
      return res.status(401).json({
        error: 'AuthenticationError',
        message: 'can not create session'
      })
    } */

    if (!userAgent) {
      return res.status(401).json({
        error: 'InvalidDeviceError',
        message: 'can not recognize device'
      })
    }

    const accessToken = await issueJwt(userId, 'accessToken')
    const { device, client, os } = await parseUserAgent(userAgent)
    const sessionId = new Types.ObjectId()
    const refreshToken = await issueJwt(sessionId.toString(), 'refreshToken')

    Session.create({
      _id: sessionId,
      userId,
      userAgent,
      refreshTokens: [{
        refreshToken
      }],
      from: { device, client, os }
    })

    return res
      .status(201)
      .cookie('at', accessToken, {
        sameSite: sessionCookie.sameSite,
        maxAge: sessionCookie.maxAge,
        httpOnly: sessionCookie.httpOnly
      })
      .cookie('rt', refreshToken, {
        sameSite: sessionCookie.sameSite,
        maxAge: sessionCookie.maxAge,
        httpOnly: sessionCookie.httpOnly
      })
      .json({
        message: 'session created'
      })
  } catch (err: any) {
    next(err)
  }
}
