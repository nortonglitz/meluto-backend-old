import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { firstNameProperty, lastNameProperty, passwordProperty, emailProperty } from '../../properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface CreateRegular {
  role: string
  firstName: string
  lastName: string
  email: string
  password: string
}

const schema: JSONSchemaType<CreateRegular> = {
  type: 'object',
  properties: {
    role: { type: 'string', const: 'regular' },
    firstName: firstNameProperty,
    lastName: lastNameProperty,
    password: passwordProperty,
    email: emailProperty
  },
  additionalProperties: false,
  required: ['role', 'password', 'email', 'firstName', 'lastName']
}

const validate = ajv.compile(schema)

export const validateCreateRegular = (data: CreateRegular) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
