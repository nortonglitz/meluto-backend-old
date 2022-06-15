import { Schema, model, Types } from 'mongoose'
import { SessionModel } from 'types/session'

const refreshTokenSchema = new Schema({
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  used: { type: Boolean, default: false }
}, { _id: false })

const clientSchema = new Schema({
  type: String,
  name: String,
  version: String,
  engine: String,
  engineVersion: String
}, { _id: false })

const osSchema = new Schema({
  name: String,
  version: String,
  platform: String
}, { _id: false })

const deviceSchema = new Schema({
  type: String,
  brand: String,
  model: String
}, { _id: false })

const fromSchema = new Schema({
  client: { type: clientSchema },
  os: { type: osSchema },
  device: { type: deviceSchema }
}, { _id: false })

const blockedSchema = new Schema({
  value: Boolean,
  reason: String
}, { timestamps: { createdAt: false }, _id: false })

const sessionSchema = new Schema<SessionModel>({
  _id: Types.ObjectId,
  userId: String,
  userAgent: String,
  ip: String,
  blocked: { type: blockedSchema, default: { updatedAt: new Date(), value: false } },
  refreshTokens: { type: [refreshTokenSchema] },
  loginTimes: { type: Number, default: 1 },
  from: { type: fromSchema },
  createdAt: { type: Date, immutable: true },
  lastLogin: { type: Date, expires: 7776000, default: Date.now }
}, { _id: false, timestamps: true })

export default model('Session', sessionSchema)
