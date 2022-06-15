import { formatError } from '../../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'
import { CPFProperty, emailProperty, firstNameProperty, lastNameProperty, passwordProperty } from 'utils/formValidation/properties'

const ajv = new Ajv()
addFormats(ajv, ['email'])

interface CreateProfessionalCPF {
  role: string
  subrole: string
  firstName: string
  lastName: string
  email: string
  password: string
  docNumber: string
}

const schema: JSONSchemaType<CreateProfessionalCPF> = {
  type: 'object',
  properties: {
    role: { type: 'string', const: 'professional' },
    subrole: { type: 'string' },
    firstName: firstNameProperty,
    lastName: lastNameProperty,
    password: passwordProperty,
    email: emailProperty,
    docNumber: CPFProperty
  },
  additionalProperties: false,
  required: ['role', 'subrole', 'firstName', 'lastName', 'password', 'email', 'docNumber']
}

const validate = ajv.compile(schema)

export const validateCreateProfessionalCPF = (data: CreateProfessionalCPF) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
