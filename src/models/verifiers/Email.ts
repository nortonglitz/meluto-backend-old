import { Schema, model } from 'mongoose'
import { EmailVerifierModel } from 'types/emailVerifier'

const emailVerifierSchema = new Schema<EmailVerifierModel>({
  email: { type: String, unique: true },
  code: String,
  createdAt: { type: Date, expires: 86400, default: Date.now }
}, { timestamps: { updatedAt: true } })

export default model('EmailVerifier', emailVerifierSchema)
