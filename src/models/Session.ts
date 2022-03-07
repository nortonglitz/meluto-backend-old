import { Schema, model, Types } from 'mongoose'
import { SessionModel } from 'types/session'

const refreshTokenSchema = new Schema({
  refreshToken: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false }
}, { _id: false, timestamps: { updatedAt: false } })

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

const sessionSchema = new Schema<SessionModel>({
  _id: { type: Types.ObjectId, required: true },
  userId: { type: String, required: true },
  userAgent: { type: String, required: true },
  blocked: { type: Boolean, default: false },
  refreshTokens: { type: [refreshTokenSchema] },
  loginTimes: { type: Number, default: 1 },
  from: { type: fromSchema },
  createdAt: { type: Date, expires: 7776000 },
  updatedAt: { type: Date }
}, { _id: false })

// expires after 90 days
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 })

export default model('Session', sessionSchema)
