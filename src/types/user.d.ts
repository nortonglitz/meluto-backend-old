export interface UserModel {
  id: string
  username: {
    value: string
    updatedAt: Date
  }
  password: {
    value: string
    updatedAt: Date
  }
  email: string
  emailVerified: boolean
  name: {
    first: string
    last: string
    updatedAt: Date
  }
  role: 'admin' | 'user' | 'real estate' | 'agent'
  createdAt: Date
  updatedAt: Date
}
