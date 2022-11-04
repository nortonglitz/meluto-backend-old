import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { validationCodeProperty, emailProperty } from '../../properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface ValidateEmail {
  code: string
  email: string
}

const schema: JSONSchemaType<ValidateEmail> = {
  type: 'object',
  properties: {
    code: validationCodeProperty,
    email: emailProperty
  },
  additionalProperties: false,
  required: ['email', 'code']
}

const validate = ajv.compile(schema)

export const validateValidateEmail = (data: ValidateEmail) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
