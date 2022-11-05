import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import { validationCodeProperty, phoneProperty } from '../../properties'

const ajv = new Ajv()

interface ValidatePhone {
  code: string
  phone: string
}

const schema: JSONSchemaType<ValidatePhone> = {
  type: 'object',
  properties: {
    code: validationCodeProperty,
    phone: phoneProperty
  },
  additionalProperties: false,
  required: ['phone', 'code']
}

const validate = ajv.compile(schema)

export const validateValidatePhone = (data: ValidatePhone) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
