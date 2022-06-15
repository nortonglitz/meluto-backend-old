import 'dotenv/config'
import 'config/database'

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from 'routes'
import { corsOpts } from 'config/cors'
import { logErrors } from 'middlewares/error'

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

try {
  const app = express()
  app.use(express.json())
  app.use(helmet())
  app.use(cookieParser())
  app.use(cors(corsOpts))
  app.use(routes)
  app.use(logErrors)
  app.listen(PORT)

  console.log(`🌎 Server running on port ${PORT}...`)
} catch (err) {
  console.log('💀 Server failed to start', err)
}
