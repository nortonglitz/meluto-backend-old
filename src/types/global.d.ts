/* eslint-disable no-unused-vars */
import { UserModel } from 'types/user'

declare global {
  namespace Express {
    export interface Request {
      user: UserModel
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      PORT: string | undefined
      NODE_ENV: string | undefined
      MONGO_URI: string | undefined
      MONGO_URI_DEV: string | undefined
      CRYPTO_PEPPER: string | undefined
      CRYPTO_ALGORITHM: string | undefined
      CRYPTO_ITERATIONS: string | undefined
      CRYPTO_KEYLEN: string | undefined
      MAPS_KEY: string | undefined
    }
  }
}
