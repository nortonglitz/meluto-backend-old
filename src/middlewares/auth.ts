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

  let user = null

  try {
    validateCredentials({ password, username, email })

    if (email) {
      user = await User.findOne({ 'email.value': email })
    } else {
      user = await User.findOne({ 'username.value': username })
    }

    if (!user) {
      return res.status(401).json({
        error: 'InvalidCredentialsError',
        message: 'password, email or username does not match.'
      })
    }

    if (!(await checkPassword(password, user.password.value))) {
      return res.status(401).json({
        error: 'InvalidCredentialsError',
        message: 'password, email or username does not match.'
      })
    }

    if (!user.email.verified) {
      return res.status(403).json({
        error: 'UnverifiedEmailError',
        message: 'email not verified'
      })
    }

    req.user = user

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
      return res.status(401)
        .clearCookie(sessionCookie.refreshTokenName)
        .json({
          error: 'AuthenticationError',
          message: 'authenticated route.'
        })
    }

    if (!accessToken.match(/^[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*$/gm)) {
      return res.status(401)
        .clearCookie(sessionCookie.accessTokenName)
        .clearCookie(sessionCookie.refreshTokenName)
        .json({
          error: 'TokenTypeError',
          message: 'invalid token.'
        })
    }

    const { sub: userId } = await verifyJwt(req.cookies.at, 'accessToken') as JwtPayload
    const userExists = await User.findById(userId)

    if (!userExists) {
      return res.status(401)
        .clearCookie(sessionCookie.accessTokenName)
        .clearCookie(sessionCookie.refreshTokenName)
        .json({
          error: 'UserNotFoundError',
          message: 'can not find user.'
        })
    }

    req.user = userExists
    return next()
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      try {
        const refreshToken = req.cookies[sessionCookie.refreshTokenName]

        if (!refreshToken) {
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .json({
              error: 'TokenEmptyError',
              message: 'invalid token.'
            })
        }

        if (!refreshToken.match(/^[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*$/gm)) {
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .clearCookie(sessionCookie.refreshTokenName)
            .json({
              error: 'TokenTypeError',
              message: 'invalid token.'
            })
        }

        const payload: JwtPayload = await verifyJwt(refreshToken, 'refreshToken') as JwtPayload
        const sessionId = payload.sub
        const session = await Session.findById(sessionId)

        if (!session) {
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .clearCookie(sessionCookie.refreshTokenName)
            .json({
              error: 'SessionInvalidError',
              message: 'session not found.'
            })
        }

        if (session.blocked.value) {
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .clearCookie(sessionCookie.refreshTokenName)
            .json({
              error: 'SessionBlockedError',
              message: 'session blocked.'
            })
        }

        if (session.userAgent !== req.headers['user-agent']) {
          await Session.findByIdAndUpdate(sessionId, { 'blocked.value': true, 'blocked.reason': 'Acessado por meio de um dispositivo diferente.' })
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .clearCookie(sessionCookie.refreshTokenName)
            .json({
              error: 'DeviceInvalidError',
              message: 'invalid device.'
            })
        }

        const index = session.refreshTokens.findIndex(token => token.refreshToken === refreshToken)

        if (index === -1) {
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .clearCookie(sessionCookie.refreshTokenName)
            .json({
              error: 'TokenInvalidError',
              message: 'refresh token invalid.'
            })
        }

        if (session.refreshTokens[index].used === true) {
          await Session.findByIdAndUpdate(sessionId, { blocked: true })
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .clearCookie(sessionCookie.refreshTokenName)
            .json({
              error: 'TokenDuplicatedError',
              message: 'duplicated refresh token.'
            })
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
          return res.status(401)
            .clearCookie(sessionCookie.accessTokenName)
            .clearCookie(sessionCookie.refreshTokenName)
            .json({
              error: 'UserNotFoundError',
              message: 'can not find user'
            })
        }

        req.user = user

        res.status(200)
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
        res.status(401)
          .clearCookie(sessionCookie.accessTokenName)
          .clearCookie(sessionCookie.refreshTokenName)
          .json({
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
