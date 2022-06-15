import { ObjectId } from 'mongoose'

type RefreshToken = {
  refreshToken: string
  used: boolean
  createdAt: Date
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
  blocked: {
    value: boolean
    updatedAt: Date
  }
  refreshTokens: RefreshToken[]
  loginTimes: number
  ip: string
  from: From
  lastLogin: Date
}
