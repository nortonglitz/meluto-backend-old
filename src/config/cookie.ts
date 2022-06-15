import { CookieOptions } from 'express'

const NODE_ENV = process.env.NODE_ENV

interface ICookie extends CookieOptions {
  accessTokenName: string,
  refreshTokenName: string
}

export const sessionCookie: ICookie = {
  accessTokenName: 'at',
  refreshTokenName: 'rt',
  maxAge: 7776000000, // use same as session expiration (90d) - time in ms
  httpOnly: true,
  sameSite: NODE_ENV === 'prod' ? 'none' : 'strict',
  secure: NODE_ENV === 'prod'
}
