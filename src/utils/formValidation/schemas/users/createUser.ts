import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { firstNameProperty, lastNameProperty, passwordProperty, emailProperty } from '../../properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface CreateUser {
  firstName: string
  lastName: string
  email: string
  password: string
}

const schema: JSONSchemaType<CreateUser> = {
  type: 'object',
  properties: {
    firstName: firstNameProperty,
    lastName: lastNameProperty,
    email: emailProperty,
    password: passwordProperty
  },
  additionalProperties: false,
  required: ['firstName', 'lastName', 'email', 'password']
}

const validate = ajv.compile(schema)

export const validateCreateUser = (data: CreateUser) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
