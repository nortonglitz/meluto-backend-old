import { Schema, model } from 'mongoose'
import { EmailVerifierModel } from 'types/emailVerifier'

const emailVerifierSchema = new Schema<EmailVerifierModel>({
  email: { type: String, unique: true },
  code: String,
  createdAt: { type: Date, expires: 86400, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default model('EmailVerifier', emailVerifierSchema)
