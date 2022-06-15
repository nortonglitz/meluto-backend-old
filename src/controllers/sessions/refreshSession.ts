import { RequestHandler } from 'express'

export const refreshSession: RequestHandler = (req, res) => {
  const user = req.user

  const { password: _deletePassword, __v, ...userInfo } = user.toObject()

  return res.json({
    user: {
      ...userInfo,
      password: {
        updatedAt: _deletePassword.updatedAt
      }
    }
  })
}
