import { Types } from 'mongoose'
import { parseUserAgent } from 'utils/devideDetector'
import { issueJwt } from 'utils/jwt'
import { RequestHandler } from 'express'
import { Session } from 'models'
import { sessionCookie } from 'config/cookie'

export const createSession: RequestHandler = async (req, res, next) => {
  const userAgent = req.headers['user-agent']
  const user = req.user
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  try {
    if (!userAgent) {
      return res.status(404).json({
        error: 'InvalidUserAgentError',
        message: 'user agent not found'
      })
    }

    const session = await Session.findOne({ userId: user.id, userAgent })

    const accessToken = await issueJwt(user.id, 'accessToken')
    let refreshToken = null

    if (!session) {
      const { device, client, os } = await parseUserAgent(userAgent)
      const sessionId = new Types.ObjectId()
      refreshToken = await issueJwt(sessionId.toString(), 'refreshToken')

      await Session.create({
        _id: sessionId,
        userId: user.id,
        userAgent,
        ip,
        refreshTokens: [{
          refreshToken
        }],
        from: { device, client, os }
      })
    } else {
      if (session.blocked.value) {
        return res.status(401).json({
          error: 'SessionBlockedError',
          message: 'this session is blocked.'
        })
      }
      refreshToken = await issueJwt(session.id, 'refreshToken')
      await Session.findByIdAndUpdate(session.id, {
        $set: {
          refreshTokens: [{
            refreshToken
          }],
          loginTimes: session.loginTimes + 1,
          ip,
          lastLogin: Date.now()
        }
      })
    }

    const { password: _deletePassword, __v, ...userInfo } = user.toObject()

    return res
      .status(201)
      .cookie(sessionCookie.accessTokenName, accessToken, {
        sameSite: sessionCookie.sameSite,
        maxAge: sessionCookie.maxAge,
        httpOnly: sessionCookie.httpOnly
      })
      .cookie(sessionCookie.refreshTokenName, refreshToken, {
        sameSite: sessionCookie.sameSite,
        maxAge: sessionCookie.maxAge,
        httpOnly: sessionCookie.httpOnly
      })
      .json({
        user: {
          ...userInfo,
          password: {
            updatedAt: _deletePassword.updatedAt
          }
        }
      })
  } catch (err: any) {
    next(err)
  }
}
