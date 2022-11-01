import { Schema, model } from 'mongoose'
import { PhoneVerifierModel } from 'types/phoneVerifier'

const phoneVerifierSchema = new Schema<PhoneVerifierModel>({
  phone: { type: String, unique: true },
  code: String,
  createdAt: { type: Date, expires: 86400, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default model('PhoneVerifier', phoneVerifierSchema)
