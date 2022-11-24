import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { firstNameProperty, passwordProperty, emailProperty, phoneProperty } from '../../properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface CreateUser {
  email: string
  name: string
  password: string
  phone: string
}

const schema: JSONSchemaType<CreateUser> = {
  type: 'object',
  properties: {
    name: firstNameProperty,
    email: emailProperty,
    password: passwordProperty,
    phone: phoneProperty
  },
  additionalProperties: false,
  required: ['email', 'name', 'password', 'phone']
}

const validate = ajv.compile(schema)

export const validateCreateUser = (data: CreateUser) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
