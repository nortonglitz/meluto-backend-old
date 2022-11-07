import { CookieOptions } from 'express'

const NODE_ENV = process.env.NODE_ENV

interface ICookie extends CookieOptions {
  accessTokenName: string,
  refreshTokenName: string
}

interface VCookie extends CookieOptions {
  verifiedEmailTokenName: string,
  verifiedPhoneTokenName: string
}

export const sessionCookie: ICookie = {
  accessTokenName: 'at',
  refreshTokenName: 'rt',
  maxAge: 7776000000, // use same as session expiration (90d) - time in ms
  httpOnly: true,
  sameSite: NODE_ENV === 'prod' ? 'none' : 'strict',
  secure: NODE_ENV === 'prod'
}

export const verifiedFieldCookie: VCookie = {
  verifiedEmailTokenName: 've',
  verifiedPhoneTokenName: 'vp',
  maxAge: 720000, // use same as verification expiration (2h) - time in ms
  httpOnly: true,
  sameSite: NODE_ENV === 'prod' ? 'none' : 'strict',
  secure: NODE_ENV === 'prod'
}
