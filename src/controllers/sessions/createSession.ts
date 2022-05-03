import { isValidObjectId, Types } from 'mongoose'
import { parseUserAgent } from 'utils/devideDetector'
import { issueJwt } from 'utils/jwt'
import { RequestHandler } from 'express'
import { Session, User } from 'models'
import { sessionCookie } from 'config/cookie'
import { checkPassword } from 'utils/cryptography'

export const createSession: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId
  const userAgent = req.headers['user-agent']

  const password = req.body.password
  const username = req.body.username
  const email = req.body.email

  try {
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({
        error: 'InvalidIdError',
        message: 'can not use this id'
      })
    }

    const userExists = await User.findById(userId)
    const authUser = await User.findOne({ $or: [{ 'username.value': username }, { email }] })

    if (!userExists || !authUser) {
      return res.status(404).json({
        error: 'InvalidUserError',
        message: 'user not found'
      })
    }

    if (userExists.id !== authUser.id) {
      return res.status(401).json({
        error: 'AuthenticationError',
        message: 'can not create session'
      })
    }

    if (!(await checkPassword(password, userExists.password.value))) {
      return res.status(401).json({
        error: 'AuthenticationError',
        message: 'password does not match'
      })
    }

    if (!userAgent) {
      return res.status(401).json({
        error: 'InvalidDeviceError',
        message: 'can not recognize device'
      })
    }

    const sessionExists = await Session.findOne({ userId, userAgent })

    const accessToken = await issueJwt(userId, 'accessToken')
    let refreshToken = null

    if (!sessionExists) {
      const { device, client, os } = await parseUserAgent(userAgent)
      const sessionId = new Types.ObjectId()
      refreshToken = await issueJwt(sessionId.toString(), 'refreshToken')

      await Session.create({
        _id: sessionId,
        userId,
        userAgent,
        refreshTokens: [{
          refreshToken
        }],
        from: { device, client, os }
      })
    } else {
      refreshToken = await issueJwt(sessionExists.id, 'refreshToken')
      await Session.findByIdAndUpdate(sessionExists.id, {
        $set: {
          refreshTokens: [{
            refreshToken
          }],
          loginTimes: sessionExists.loginTimes + 1,
          lastLogin: Date.now()
        }
      })
    }

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
        message: 'session created'
      })
  } catch (err: any) {
    next(err)
  }
}
