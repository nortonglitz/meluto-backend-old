import { ErrorObject } from 'ajv'

export const formatError = (errors: ErrorObject[] | undefined | null) => {
  if (errors) {
    const e = new Error(`(${errors[0].keyword}) ${errors[0].message}`)
    e.name = 'ValidationError'
    e.stack = errors[0].instancePath

    throw e
  }
}
