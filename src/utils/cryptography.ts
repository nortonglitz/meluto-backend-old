import { randomBytes, pbkdf2, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

if (!process.env.CRYPTO_PEPPER) {
  throw new Error('Cryptography is impaired, pepper is missing. Please edit .env file.')
}

if (!process.env.CRYPTO_ALGORITHM) {
  throw new Error('Cryptography is impaired, algorithm is missing. Please edit .env file.')
}

if (!process.env.CRYPTO_ITERATIONS) {
  throw new Error('Cryptography is impaired, iterations is missing. Please edit .env file.')
}

if (!process.env.CRYPTO_KEYLEN) {
  throw new Error('Cryptography is impaired, keylen is missing. Please edit .env file.')
}

const PEPPER = process.env.CRYPTO_PEPPER
const ALGORITHM = process.env.CRYPTO_ALGORITHM
const ITERATIONS = Number(process.env.CRYPTO_ITERATIONS)
const KEYLEN = Number(process.env.CRYPTO_KEYLEN)

const generateBytes = promisify(randomBytes)
const generateHash = promisify(pbkdf2)

export const saltHashPassword = async (password: string) => {
  const salt = (await generateBytes(32)).toString('base64url')
  const hash = (await generateHash(password + PEPPER, salt, ITERATIONS, KEYLEN, ALGORITHM)).toString('base64url')

  return `${salt}:${hash}`
}

export const checkPassword = async (password: string, saltHash: string) => {
  const [salt, hash] = saltHash.split(':')
  const checkHash = (await generateHash(password + PEPPER, salt, ITERATIONS, KEYLEN, ALGORITHM))

  return timingSafeEqual(checkHash, Buffer.from(hash, 'base64url'))
}
