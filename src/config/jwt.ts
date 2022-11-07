import { JwtConfig } from 'types/jwt'

export const accessToken: JwtConfig = {
  algorithm: 'ES256',
  algorithms: ['ES256'],
  expiresIn: '15s'
}

export const refreshToken: JwtConfig = {
  algorithm: 'ES256',
  algorithms: ['ES256'],
  expiresIn: '90d'
}

export const verifiedFieldToken: JwtConfig = {
  algorithm: 'ES256',
  algorithms: ['ES256'],
  expiresIn: '2h'
}
