import { CorsOptions } from 'cors'

export const corsOpts: CorsOptions = {
  credentials: true,
  origin: ['http://localhost:3000', 'http://192.168.0.190:3000']
}
