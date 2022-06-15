import winston, { format } from 'winston'

const { combine, timestamp, printf, colorize, json } = format

const myFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `[${timestamp}] (${label}) ${level}: ${message} ${stack}`
})

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    json(),
    timestamp({ format: 'dd/MMM HH:mm:ss.SSS' }),
    myFormat
  ),
  transports: new winston.transports.File({ dirname: 'logs', filename: 'list.log' })
})

if (process.env.NODE_ENV !== 'prod') {
  logger.add(new winston.transports.Console({
    format: combine(
      timestamp({ format: 'HH:mm:ss.SSS' }),
      colorize({ all: true })
    )
  }))
}

export default logger
