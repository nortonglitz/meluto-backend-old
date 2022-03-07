import { ObjectId } from 'mongoose'

type RefreshToken = {
  refreshToken: string
  used: boolean
}

type From = {
  client: {
    type: string
    name: string
    version: string
    engine: string
    engineVersion: string
  }
  os: {
    name: string
    version: string
    platform: string
  }
  device: {
    type: string
    brand: string
    model: string
  }
}

export interface SessionModel {
  _id: ObjectId
  userId: string
  userAgent: string
  createdAt: Date
  updatedAt: Date
  blocked: boolean
  refreshTokens: RefreshToken[]
  loginTimes: number
  from: From
}