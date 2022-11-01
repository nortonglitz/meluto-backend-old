import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import { phoneProperty } from '../properties'

const ajv = new Ajv()

interface EditPhone {
  phone: string
}

const schema: JSONSchemaType<EditPhone> = {
  type: 'object',
  properties: {
    phone: phoneProperty
  },
  additionalProperties: false,
  required: ['phone']
}

const validate = ajv.compile(schema)

export const validatePhone = (data: EditPhone) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
