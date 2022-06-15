import { RequestHandler } from 'express'

export const getLoggedUser: RequestHandler = async (req, res, next) => {
  const { password: _deletePassword, ...userInfo } = req.user

  if (req.user) {
    return res.status(200).json({
      user: userInfo
    })
  } else {
    return res.status(401).json({
      error: 'UserNotFoundError',
      message: 'you are not logged'
    })
  }
}
