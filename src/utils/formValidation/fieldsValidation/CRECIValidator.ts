import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import { CRECIStateProperty, CRECINumberProperty } from '../properties'

const ajv = new Ajv()

interface CRECIInterface {
  CRECINumber: string
  CRECIState: string
}

const schema: JSONSchemaType<CRECIInterface> = {
  type: 'object',
  properties: {
    CRECINumber: CRECINumberProperty,
    CRECIState: CRECIStateProperty
  },
  additionalProperties: false,
  required: ['CRECINumber', 'CRECIState']
}

const validate = ajv.compile(schema)

export const validateCRECI = (data: CRECIInterface) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
