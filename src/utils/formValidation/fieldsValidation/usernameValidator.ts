import { formatError } from '../formatError'
import Ajv, { JSONSchemaType } from 'ajv'
import { usernameProperty } from '../properties'

const ajv = new Ajv()

interface EditUsername {
  username: string
}

const schema: JSONSchemaType<EditUsername> = {
  type: 'object',
  properties: {
    username: usernameProperty
  },
  additionalProperties: false,
  required: ['username']
}

const validate = ajv.compile(schema)

export const validateUsername = (username: string) => {
  if (validate({ username })) {
    return
  }

  formatError(validate.errors)
}
