import { RequestHandler } from 'express'
import { TemporaryUser } from 'models'

export const uploadTemporaryUserDocs: RequestHandler = async (req, res, next) => {
  console.log(req.body)
}
