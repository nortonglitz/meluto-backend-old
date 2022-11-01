import { JSONSchemaType } from 'ajv'

const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

const roles = [
  'regular', 'admin', 'professional'
]

const taxInfos = ['CPF', 'CNPJ']

export const passwordProperty: JSONSchemaType<string> = {
  type: 'string',
  minLength: 8,
  pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]+$'
}

export const tradingName: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ0-9 ]+$',
  minLength: 3,
  maxLength: 55
}

export const companyName: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[A-Za-z0-9 ]+$',
  minLength: 3,
  maxLength: 55
}

export const descriptionProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[0-9A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$|^$',
  maxLength: 150
}

export const firstNameProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$',
  minLength: 3,
  maxLength: 25
}

export const lastNameProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$',
  minLength: 3,
  maxLength: 25
}

export const emailProperty: JSONSchemaType<string> = {
  type: 'string',
  format: 'email',
  maxLength: 60
}

export const usernameProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[a-z0-9]+$',
  minLength: 3,
  maxLength: 25
}

export const CRECINumberProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[0-9]{6}$'
}
export const CRECIStateProperty: JSONSchemaType<typeof states[number]> = {
  type: 'string',
  pattern: '^[A-Z]{2}$',
  enum: states
}

export const roleProperty: JSONSchemaType<typeof roles[number]> = {
  type: 'string',
  enum: roles
}

export const taxInfoProperty: JSONSchemaType<typeof taxInfos[number]> = {
  type: 'string',
  enum: ['CPF', 'CNPJ']
}

export const CPFProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[0-9]{11}$'
}

export const CNPJProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[0-9]{14}$'
}

export const phoneProperty: JSONSchemaType<string> = {
  type: 'string',
  pattern: '^[0-9]{11}$'
}
