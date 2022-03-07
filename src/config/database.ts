import mongoose from 'mongoose'
import logger from './logger'

const NODE_ENV = process.env.NODE_ENV
const MONGO_URI = process.env.MONGO_URI
const MONGO_URI_DEV = process.env.MONGO_URI_DEV

const startDatabaseConnection = async () => {
  try {
    if (!MONGO_URI) {
      const e = new Error('Connection to database is impaired, no production URI available. Please edit .env file.')
      e.name = 'InvalidDatabaseURI'
      throw e
    }

    if (!MONGO_URI_DEV) {
      const e = new Error('Connection to database is impaired, no development URI available. Please edit .env file.')
      e.name = 'InvalidDatabaseURI'
      throw e
    }

    await mongoose.connect(NODE_ENV === 'production' ? MONGO_URI : MONGO_URI_DEV)

    mongoose.connection.on('error', err => {
      throw err
    })
  } catch (err: any) {
    logger.error({
      message: err.message,
      label: err.name,
      stack: err.stack
    })
  }
}

startDatabaseConnection()
