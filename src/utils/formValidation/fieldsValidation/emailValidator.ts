import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { emailProperty } from '../properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface EditEmail {
  email: string
}

const schema: JSONSchemaType<EditEmail> = {
  type: 'object',
  properties: {
    email: emailProperty
  },
  additionalProperties: false,
  required: ['email']
}

const validate = ajv.compile(schema)

export const validateEmail = (email: string) => {
  if (validate({ email })) {
    return
  }

  formatError(validate.errors)
}
