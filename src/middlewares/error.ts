import { ErrorRequestHandler } from 'express'
import logger from 'config/logger'

export const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name.includes('SyntaxError')) {
    return res.status(400).json({
      error: 'SyntaxError',
      message: 'code can not be parsed'
    })
  }
  logger.error({
    message: err.message,
    label: err.name,
    stack: err.stack
  })
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'something went wrong'
  })
}
