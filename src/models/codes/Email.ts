import { Schema, model } from 'mongoose'
import { EmailCodeModel } from 'types/emailCode'

const emailCodeSchema = new Schema<EmailCodeModel>({
  email: { type: String, unique: true },
  code: String,
  createdAt: { type: Date, expires: 3600, default: Date.now }
})

export default model('EmailCode', emailCodeSchema)
