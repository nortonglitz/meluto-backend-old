import { sign, SignOptions, Secret, VerifyOptions, verify, Jwt, JwtPayload } from 'jsonwebtoken'
import { accessToken, refreshToken, verifiedFieldToken } from 'config/jwt'
import { resolve } from 'path'
import { readFile } from 'fs'
import { promisify } from 'util'

const privKeyPath = resolve(__dirname, '..', '..', 'priv_key.pem')
const pubKeyPath = resolve(__dirname, '..', '..', 'pub_key.pem')
const read = promisify(readFile)

const asyncVerify = (
  token: string,
  secretOrPublicKey: Secret,
  options: VerifyOptions
) => {
  return new Promise<string | Jwt | JwtPayload>((resolve, reject) => {
    verify(token, secretOrPublicKey, options, (err, decoded) => {
      if (err) reject(err)
      if (!decoded) {
        const e = new Error('invalid secret issued')
        e.name = 'VerifyTokenError'
        reject(e)
      } else {
        resolve(decoded)
      }
    })
  })
}

const asyncSign = (
  payload: string | object | Buffer,
  secretOrPrivateKey: Secret,
  options: SignOptions
) => {
  return new Promise<string>((resolve, reject) => {
    sign(payload, secretOrPrivateKey, options, (err, encoded) => {
      if (err) reject(err)
      if (!encoded) {
        const e = new Error('could not generate token')
        e.name = 'GenerateTokenError'
        reject(e)
      } else {
        resolve(encoded)
      }
    })
  })
}

/* ISSUERS */

export const issueSessionJwt = async (id: string, type: 'refreshToken' | 'accessToken') => {
  const privKey = await read(privKeyPath, 'utf8')
  const payload = {
    sub: id
  }

  const token = await asyncSign(payload, privKey, {
    expiresIn: type === 'accessToken' ? accessToken.expiresIn : refreshToken.expiresIn,
    algorithm: type === 'accessToken' ? accessToken.algorithm : refreshToken.algorithm
  })

  return token
}

export const issueFieldToken = async (id: string) => {
  const privKey = await read(privKeyPath, 'utf8')
  const payload = {
    sub: id
  }

  const token = await asyncSign(payload, privKey, {
    expiresIn: verifiedFieldToken.expiresIn,
    algorithm: verifiedFieldToken.algorithm
  })

  return token
}

/* VERIFIERS */

export const verifySessionJwt = async (token: string, type: 'refreshToken' | 'accessToken') => {
  const pubKey = await read(pubKeyPath, 'utf8')

  const payload = await asyncVerify(token, pubKey, {
    algorithms: type === 'accessToken' ? accessToken.algorithms : refreshToken.algorithms
  })

  return payload
}

export const verifyFieldJwt = async (token: string) => {
  const pubKey = await read(pubKeyPath, 'utf8')

  const payload = await asyncVerify(token, pubKey, {
    algorithms: verifiedFieldToken.algorithms
  })

  return payload
}
