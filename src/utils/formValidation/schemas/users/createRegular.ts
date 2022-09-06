import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { firstNameProperty, lastNameProperty, emailProperty } from '../../properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface CreateRegular {
  role: string
  firstName: string
  lastName: string
  email: string
}

const schema: JSONSchemaType<CreateRegular> = {
  type: 'object',
  properties: {
    role: { type: 'string', const: 'regular' },
    firstName: firstNameProperty,
    lastName: lastNameProperty,
    email: emailProperty
  },
  additionalProperties: false,
  required: ['role', 'email', 'firstName', 'lastName']
}

const validate = ajv.compile(schema)

export const validateCreateRegular = (data: CreateRegular) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
