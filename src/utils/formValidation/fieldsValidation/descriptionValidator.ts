import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import { descriptionProperty } from '../properties'

const ajv = new Ajv()

interface DescriptionInterface {
  description: string
}

const schema: JSONSchemaType<DescriptionInterface> = {
  type: 'object',
  properties: {
    description: descriptionProperty
  },
  additionalProperties: false,
  required: ['description']
}

const validate = ajv.compile(schema)

export const validateDescription = (data: DescriptionInterface) => {
  if (validate(data)) {
    return
  }

  formatError(validate.errors)
}
