import { Schema, model } from 'mongoose'
import { UserModel } from 'types/user'

const namesSchema = new Schema({
  first: String,
  last: String,
  trading: String,
  company: String
}, { timestamps: { createdAt: false }, _id: false })

const passwordSchema = new Schema({
  value: { type: String, required: true }
}, { timestamps: { createdAt: false }, _id: false })

const usernameSchema = new Schema({
  value: { type: String, unique: true, required: true }
}, { timestamps: { createdAt: false }, _id: false })

const emailSchema = new Schema({
  value: { type: String, unique: true, required: true },
  verified: { type: Boolean, default: false }
}, { timestamps: { createdAt: false }, _id: false })

const whatsappSchema = new Schema({
  value: { type: String },
  verified: { type: Boolean, default: false }
}, { timestamps: { createdAt: false }, _id: false })

const addressSchema = new Schema({
  state: String,
  city: String,
  district: String,
  postalCode: String,
  thoroughfare: String,
  additionalInfo: String,
  number: String
}, { timestamps: { createdAt: false }, _id: false })

const docSchema = new Schema({
  value: String,
  files: [String],
  verified: { type: Boolean, default: false }
}, { timestamps: { createdAt: false }, _id: false })

const CRECISchema = new Schema({
  value: { type: String },
  files: [String],
  state: String,
  verified: { type: Boolean, default: false }
}, { timestamps: { createdAt: false }, _id: false })

const blockedSchema = new Schema({
  value: Boolean,
  reason: String
}, { timestamps: { createdAt: false }, _id: false })

const verifiedSchema = new Schema({
  value: Boolean
}, { timestamps: { createdAt: false }, _id: false })

const avatarSchema = new Schema({
  value: String
}, { timestamps: { createdAt: false }, _id: false })

const userSchema = new Schema<UserModel>({
  username: { type: usernameSchema, required: true },
  password: { type: passwordSchema, required: true },
  names: namesSchema,
  avatar: { type: avatarSchema, default: { updatedAt: new Date(), value: 'https://storage.googleapis.com/meluto/users/avatar.png' } },
  email: { type: emailSchema, required: true },
  role: { type: String, default: 'regular' },
  taxInfo: String,
  subrole: String,
  whatsapp: whatsappSchema,
  telephone: String,
  site: String,
  birthdate: Date,
  businessActivity: String,
  address: addressSchema,
  description: String,
  docs: {
    CPF: docSchema,
    CNPJ: docSchema,
    CRECI: CRECISchema
  },
  socialMedias: { instagram: String, youtube: String, facebook: String },
  blocked: { type: blockedSchema, default: { updatedAt: new Date(), value: false } },
  verified: { type: verifiedSchema, default: { updatedAt: new Date(), value: false } },
  createdAt: { type: Date, immutable: true }
}, { timestamps: true })

export default model('User', userSchema)
