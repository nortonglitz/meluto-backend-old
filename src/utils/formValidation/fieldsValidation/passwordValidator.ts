import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import { passwordProperty } from '../properties'

const ajv = new Ajv()

interface EditPassword {
  password: string
}

const schema: JSONSchemaType<EditPassword> = {
  type: 'object',
  properties: {
    password: passwordProperty
  },
  additionalProperties: false,
  required: ['password']
}

const validate = ajv.compile(schema)

export const validatePassword = (password: string) => {
  if (validate({ password })) {
    return
  }

  formatError(validate.errors)
}
