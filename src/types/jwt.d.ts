import { Algorithm } from 'jsonwebtoken'

export interface JwtConfig {
  algorithm: Algorithm
  algorithms: Algorithm[],
  expiresIn?: string | number
}
