import { CookieOptions } from 'express'

interface ICookie extends CookieOptions {
  accessTokenName: string,
  refreshTokenName: string
}

export const sessionCookie: ICookie = {
  accessTokenName: 'at',
  refreshTokenName: 'rt',
  maxAge: 7776000000, // use same as session expiration (90d) - time in ms
  httpOnly: true,
  sameSite: 'strict'
}
