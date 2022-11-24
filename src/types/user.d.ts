import { Document } from 'mongoose'

export interface UserModel extends Document {
  id: string
  username: {
    value: string
    updatedAt: Date
  }
  password: {
    value: string
    updatedAt: Date
  }
  email: {
    value: string
    verified: boolean
    updatedAt: Date
  }
  avatar: {
    value: string
    updatedAt: Date
  }
  names: {
    first: string
    last: string
    trading: string // nome fantasia
    company: string // razao social
    updatedAt: Date
  }
  socialMedias: {
    instagram: string
    youtube: string
    facebook: string
  }
  site: string
  description: string
  phone: {
    value: string
    verified: boolean
    updatedAt: Date
  }
  whatsapp: {
    value: string
    verified: boolean
    updatedAt: Date
  }
  businessActivity: 'real estate'
  role: 'admin' | 'professional' | 'regular'
  taxInfo: 'individual' | 'company'
  subrole: string
  birthdate: Date
  address: {
    state: string // rj
    city: string // rio de janeiro
    district: string // bairro
    postalCode: string // cep
    thoroughfare: string // rua
    number: string // número
    additionalInfo: string // complemento
    updatedAt: Date
  }
  docs: {
    CRECI: {
      value: string
      state: string
      verified: boolean
      updatedAt: Date
    }
    CPF: {
      value: string
      verified: boolean
      updatedAt: Date
    }
    CNPJ: {
      value: string
      verified: boolean
      updatedAt: Date
    }
  }
  verified: {
    value: boolean,
    updatedAt: Date
  }
  blocked: {
    value: boolean
    updatedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}
