import { RequestHandler } from 'express'
import { TemporaryUser } from 'models'
import { saltHashPassword } from 'utils/cryptography'
import { isValidObjectId } from 'mongoose'
import { validateName, validatePassword } from 'utils/formValidation'

export const editTemporaryUser: RequestHandler = async (req, res, next) => {
  const field = req.params.field
  const temporaryUserId = req.params.temporaryUserId as any

  const { firstName, lastName, password, confirmPassword } = req.body

  try {
    if (!temporaryUserId || !isValidObjectId(temporaryUserId)) {
      return res.status(400).json({
        error: 'InvalidIdError',
        message: 'can not use this id'
      })
    }

    const temporaryUserExists = await TemporaryUser.findById(temporaryUserId)

    if (!temporaryUserExists) {
      return res.status(400).json({
        error: 'TemporaryUserNotFoundError',
        message: 'this is a invalid temporary user id.'
      })
    }

    const isProfessional = temporaryUserExists.role === 'professional'

    let modifiedTemporaryUser = null

    if (field === 'names' && !isProfessional) {
      validateName({ firstName, lastName })
      modifiedTemporaryUser = await TemporaryUser.findByIdAndUpdate(temporaryUserId, {
        'names.first': firstName, 'names.last': lastName
      }, { new: true })
    }

    if (field === 'password') {
      validatePassword(password, confirmPassword)
      modifiedTemporaryUser = await TemporaryUser.findByIdAndUpdate(temporaryUserId, {
        password: await saltHashPassword(password)
      }, { new: true })
    }

    if (!modifiedTemporaryUser) {
      return res.status(400).json({
        error: 'InvalidFieldError',
        message: 'can not modify temporary user.'
      })
    }

    const { password: _deletePassword, __v, ...temporaryUserInfo } = modifiedTemporaryUser.toObject()

    return res.status(200).json({
      temporaryUser: {
        ...temporaryUserInfo,
        password: !!_deletePassword
      }
    })
  } catch (err: any) {
    if (err.name.includes('ValidationError')) {
      return res.status(400).json({
        error: err.name,
        path: err.stack,
        message: err.message
      })
    }
    next(err)
  }
}
