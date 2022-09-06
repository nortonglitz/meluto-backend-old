import { Schema, model } from 'mongoose'
import { TemporaryUserModel } from 'types/temporaryUser'

const temporaryUserSchema = new Schema<TemporaryUserModel>({
  role: String,
  subrole: String,
  taxInfo: String,
  businessActivity: String,
  names: {
    first: String,
    last: String,
    trading: String,
    company: String
  },
  email: {
    value: { type: String, unique: true },
    verified: Boolean
  },
  password: String,
  docs: {
    CRECI: {
      value: String,
      state: String,
      files: [String],
      verified: Boolean
    },
    CPF: {
      value: String,
      files: [String],
      verified: Boolean
    },
    CNPJ: {
      value: String,
      files: [String],
      verified: Boolean
    }
  }
}, { timestamps: true })

export default model('TemporaryUser', temporaryUserSchema)
