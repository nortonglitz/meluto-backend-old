import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'

const ajv = new Ajv()

interface EditTradingName {
  tradingName: string
}

const schema: JSONSchemaType<EditTradingName> = {
  type: 'object',
  properties: {
    tradingName: { type: 'string' }
  },
  additionalProperties: false,
  required: ['tradingName']
}

const validate = ajv.compile(schema)

export const validateTradingName = (data: EditTradingName) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
