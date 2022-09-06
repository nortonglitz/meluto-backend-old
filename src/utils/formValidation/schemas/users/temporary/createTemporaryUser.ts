import { formatError } from '../../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { emailProperty } from 'utils/formValidation/properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface CreateTemporaryUser {
  role: string
  email: string
}

const schema: JSONSchemaType<CreateTemporaryUser> = {
  type: 'object',
  properties: {
    role: { type: 'string', enum: ['professional', 'regular'] },
    email: emailProperty
  },
  additionalProperties: false,
  required: ['role', 'email']
}

const validate = ajv.compile(schema)

export const validateCreateTemporaryUser = (data: CreateTemporaryUser) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
