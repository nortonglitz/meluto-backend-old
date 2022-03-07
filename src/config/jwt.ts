import { JwtConfig } from 'types/jwt'

export const accessToken: JwtConfig = {
  algorithm: 'ES256',
  algorithms: ['ES256'],
  expiresIn: '15m'
}

export const refreshToken: JwtConfig = {
  algorithm: 'ES256',
  algorithms: ['ES256'],
  expiresIn: '90d'
}
