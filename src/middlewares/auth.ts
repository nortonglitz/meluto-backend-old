import { RequestHandler } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { sessionCookie } from 'config/cookie'
import { User, Session } from 'models'
import { validateCredentials } from 'utils/formValidation/schemas/auth/checkCredentials'
import { checkPassword } from 'utils/cryptography'
import { verifyJwt, issueJwt } from 'utils/jwt'

export const checkCredentials: RequestHandler = async (req, res, next) => {
  const password = req.body.password
  const username = req.body.username
  const email = req.body.email

  let userExists = null

  try {
    validateCredentials({ password, username, email })

    if (email) {
      userExists = await User.findOne({ email })
    } else {
      userExists = await User.findOne({ 'username.value': username })
    }

    if (!userExists) {
      return res.status(400).json({
        error: 'InvalidUserError',
        message: 'user is not available'
      })
    }

    req.user = userExists

    return next()
  } catch (err: any) {
    if (err.name.includes('ValidationError')) {
      return res.status(400).json({
        error: err.name,
        path: err.stack,
        message: err.message
      })
    }
    return next(err)
  }
}

export const authenticated: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = req.cookies[sessionCookie.accessTokenName]

    if (!accessToken) {
      return res.status(401).json({
        error: 'AuthenticationError',
        message: 'authenticated route'
      })
    }

    if (!accessToken.match(/^[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*$/gm)) {
      const e = new Error('Token does not match')
      e.name = 'TokenTypeError'
      throw e
    }

    const { sub: userId } = await verifyJwt(req.cookies.at, 'accessToken') as JwtPayload
    const userExists = await User.findById(userId)

    if (!userExists) {
      return res.status(404).json({
        error: 'UserNotFoundError',
        message: 'can not find user'
      })
    }

    req.user = userExists
    return next()
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      try {
        const refreshToken = req.cookies[sessionCookie.refreshTokenName]

        if (!refreshToken) {
          const e = new Error('Token is empty')
          e.name = 'TokenEmptyError'
          throw e
        }

        if (!refreshToken.match(/^[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*$/gm)) {
          const e = new Error('Token does not match')
          e.name = 'TokenTypeError'
          throw e
        }

        const payload: JwtPayload = await verifyJwt(refreshToken, 'refreshToken') as JwtPayload
        const sessionId = payload.sub
        const session = await Session.findById(sessionId)

        if (!session) {
          const e = new Error('Session not found')
          e.name = 'SessionInvalidError'
          throw e
        }

        if (session.blocked) {
          const e = new Error('Session blocked')
          e.name = 'SessionBlockedError'
          throw e
        }

        if (session.userAgent !== req.headers['user-agent']) {
          await Session.findByIdAndUpdate(sessionId, { blocked: true })
          const e = new Error('Invalid device')
          e.name = 'DeviceInvalidError'
          throw e
        }

        const index = session.refreshTokens.findIndex(token => token.refreshToken === refreshToken)

        if (index === -1) {
          const e = new Error('Refresh token invalid')
          e.name = 'TokenInvalidError'
          throw e
        }

        if (session.refreshTokens[index].used === true) {
          await Session.findByIdAndUpdate(sessionId, { blocked: true })
          const e = new Error('Duplicate refresh token')
          e.name = 'TokenDuplicateError'
          throw e
        }

        session.refreshTokens[index] = {
          refreshToken: session.refreshTokens[index].refreshToken,
          createdAt: session.refreshTokens[index].createdAt,
          used: true
        }

        const newRefreshToken = await issueJwt(session.id, 'refreshToken')
        const newAccessToken = await issueJwt(session.userId, 'accessToken')

        if (session.refreshTokens.length >= 5) {
          session.refreshTokens.shift()
        }

        await Session.findByIdAndUpdate(sessionId, {
          refreshTokens: [
            ...session.refreshTokens,
            { refreshToken: newRefreshToken }
          ]
        })

        const user = await User.findById(session.userId)

        if (!user) {
          return res.status(404).json({
            error: 'UserNotFoundError',
            message: 'can not find user'
          })
        }

        req.user = user

        res
          .status(200)
          .cookie(sessionCookie.accessTokenName, newAccessToken, {
            sameSite: sessionCookie.sameSite,
            maxAge: sessionCookie.maxAge,
            httpOnly: sessionCookie.httpOnly
          })
          .cookie(sessionCookie.refreshTokenName, newRefreshToken, {
            sameSite: sessionCookie.sameSite,
            maxAge: sessionCookie.maxAge,
            httpOnly: sessionCookie.httpOnly
          })

        return next()
      } catch (err: any) {
        res.status(401).json({
          error: err.name,
          message: err.message
        })
      }
    } else {
      return next(err)
    }
  }
}

export const passwordRequired: RequestHandler = async (req, res, next) => {
  try {
    const password = req.body.password
    const userPassword = req.user.password.value
    const user = req.user

    if (!user) {
      return res.status(401).json({
        error: 'InvalidUserError',
        message: 'user can not be found'
      })
    }

    if (!(await checkPassword(password, userPassword))) {
      return res.status(401).json({
        error: 'AuthenticationError',
        message: 'password does not match'
      })
    }

    return next()
  } catch (err: any) {
    next(err)
  }
}
