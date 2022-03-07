import { Schema, model } from 'mongoose'
import { UserModel } from 'types/user'

const nameSchema = new Schema({
  first: { type: String, required: [true, 'First name is required.'] },
  last: { type: String, required: [true, 'Last name is required.'] }
}, { timestamps: { createdAt: false }, _id: false })

const passwordSchema = new Schema({
  value: { type: String, required: [true, 'Password is required.'] }
}, { timestamps: { createdAt: false }, _id: false })

const usernameSchema = new Schema({
  value: { type: String, unique: true, required: true }
}, { timestamps: { createdAt: false }, _id: false })

const userSchema = new Schema<UserModel>({
  username: { type: usernameSchema },
  password: { type: passwordSchema },
  name: { type: nameSchema },
  email: { type: String, required: [true, 'E-mail is required.'], unique: true },
  emailVerified: { type: Boolean, default: false },
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'admin', 'real estate', 'construction company', 'developer company', 'agent'],
      message: '{VALUE} is not a valid role.'
    }
  },
  createdAt: { type: Date, immutable: true }
}, { timestamps: true })

export default model('User', userSchema)
