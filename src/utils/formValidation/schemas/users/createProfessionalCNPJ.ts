import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { CNPJProperty, emailProperty, passwordProperty } from 'utils/formValidation/properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface CreateProfessionalCNPJ {
  role: string
  subrole: string
  companyName: string
  tradingName: string
  email: string
  password: string
  docNumber: string
}

const schema: JSONSchemaType<CreateProfessionalCNPJ> = {
  type: 'object',
  properties: {
    role: { type: 'string', const: 'professional' },
    subrole: { type: 'string' },
    companyName: { type: 'string' },
    tradingName: { type: 'string' },
    password: passwordProperty,
    email: emailProperty,
    docNumber: CNPJProperty
  },
  additionalProperties: false,
  required: ['role', 'subrole', 'companyName', 'tradingName', 'password', 'email', 'docNumber']
}

const validate = ajv.compile(schema)

export const validateCreateProfessionalCNPJ = (data: CreateProfessionalCNPJ) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
