import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import { firstNameProperty, lastNameProperty } from '../properties'

const ajv = new Ajv()

interface EditName {
  firstName: string
  lastName: string
}

const schema: JSONSchemaType<EditName> = {
  type: 'object',
  properties: {
    firstName: firstNameProperty,
    lastName: lastNameProperty
  },
  additionalProperties: false,
  required: ['firstName', 'lastName']
}

const validate = ajv.compile(schema)

export const validateName = (data: EditName) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
