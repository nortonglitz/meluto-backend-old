import { formatError } from '../formatError'
import Ajv from 'ajv'
import { passwordProperty } from '../properties'

const ajv = new Ajv({ $data: true })

const schema = {
  type: 'object',
  properties: {
    newPassword: passwordProperty,
    confirmNewPassword: { const: { $data: '1/newPassword' } }
  },
  additionalProperties: false,
  required: ['newPassword', 'confirmNewPassword']
}

const validate = ajv.compile(schema)

export const validatePassword = (newPassword: string, confirmNewPassword: string) => {
  if (validate({ newPassword, confirmNewPassword })) {
    return
  }

  formatError(validate.errors)
}
