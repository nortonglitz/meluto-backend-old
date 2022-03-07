import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'

const ajv = new Ajv()

interface Credentials {
  username: string
  email: string
  password: string
}

const schema: JSONSchemaType<Credentials> = {
  type: 'object',
  properties: {
    password: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' }
  },
  anyOf: [{ required: ['email'] }, { required: ['username'] }],
  required: ['password'],
  additionalProperties: false
}

const validate = ajv.compile(schema)

export const validateCredentials = (data: Credentials) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
