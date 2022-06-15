import { randomString } from 'utils/random'
import { RequestHandler } from 'express'
import { User } from 'models'
import { subDays } from 'date-fns'
import { saltHashPassword } from 'utils/cryptography'
import { validateCreateRegular, validateCreateProfessionalCPF, validateCreateProfessionalCNPJ, validateCRECI } from 'utils/formValidation'

export const createUser: RequestHandler = async (req, res, next) => {
  const {
    role, subrole, firstName, lastName, docType,
    docNumber, CRECINumber, CRECIState, tradingName,
    companyName, email, password
  } = req.body

  try {
    const userExists = await User.findOne({ 'email.value': email })

    if (userExists) {
      return res.status(409).json({
        error: 'DuplicateEmailError',
        message: 'can not use that email'
      })
    }

    if (docType === 'CPF') {
      const CPFExists = await User.findOne({ 'docs.CPF.value': docNumber })
      if (CPFExists) {
        return res.status(409).json({
          error: 'DuplicateCPFError',
          message: 'can not use that number'
        })
      }
    }

    if (docType === 'CNPJ') {
      const CNPJExists = await User.findOne({ 'docs.CNPJ.value': docNumber })
      if (CNPJExists) {
        return res.status(409).json({
          error: 'DuplicateCNPJError',
          message: 'can not use that number'
        })
      }
    }

    if (CRECINumber) {
      const CRECIExists = await User.findOne({ 'docs.CRECI.value': CRECINumber })
      if (CRECIExists) {
        return res.status(409).json({
          error: 'DuplicateCRECIError',
          message: 'can not use that number'
        })
      }
    }

    let newUser = null

    if (role === 'regular') {
      validateCreateRegular({
        role,
        email,
        firstName,
        lastName,
        password
      })

      newUser = await User.create({
        role,
        username: {
          value: randomString(14)
        },
        names: {
          first: firstName,
          last: lastName
        },
        email: {
          value: email
        },
        password: {
          value: await saltHashPassword(password)
        },
        taxInfo: 'individual'
      })
    }

    if (role === 'professional' && docType === 'CPF') {
      validateCreateProfessionalCPF({
        role,
        subrole,
        firstName,
        lastName,
        docNumber,
        email,
        password
      })
      if (subrole === 'realtor') {
        validateCRECI({ CRECINumber, CRECIState })
        newUser = await User.create({
          role,
          subrole,
          businessActivity: 'real estate',
          taxInfo: 'individual',
          username: {
            value: randomString(14),
            updatedAt: new Date(subDays(new Date(), 60))
          },
          names: {
            first: firstName,
            last: lastName
          },
          docs: {
            CPF: {
              value: docNumber
            },
            CRECI: {
              value: CRECINumber,
              state: CRECIState
            }
          },
          email: {
            value: email
          },
          password: {
            value: await saltHashPassword(password)
          }
        })
      }
    }

    if (role === 'professional' && docType === 'CNPJ') {
      validateCreateProfessionalCNPJ({
        role,
        subrole,
        companyName,
        tradingName,
        docNumber,
        email,
        password
      })
      if (subrole === 'real estate') {
        validateCRECI({ CRECINumber, CRECIState })
        newUser = await User.create({
          role,
          subrole,
          businessActivity: 'real estate',
          taxInfo: 'company',
          username: {
            value: randomString(14)
          },
          names: {
            company: companyName,
            trading: tradingName
          },
          docs: {
            CNPJ: {
              value: docNumber
            },
            CRECI: {
              value: CRECINumber,
              state: CRECIState
            }
          },
          email: {
            value: email
          },
          password: {
            value: await saltHashPassword(password)
          }
        })
      }
      if (subrole === 'construction company') {
        console.log('passei no construction')
        newUser = await User.create({
          role,
          subrole,
          businessActivity: 'real estate',
          taxInfo: 'company',
          username: {
            value: randomString(14)
          },
          names: {
            company: companyName,
            trading: tradingName
          },
          docs: {
            CNPJ: {
              value: docNumber
            }
          },
          email: {
            value: email
          },
          password: {
            value: await saltHashPassword(password)
          }
        })
      }
    }

    if (!newUser) {
      return res.status(400).json({
        error: 'InvalidRoleError',
        message: 'choose a correct role'
      })
    }

    const { password: _deletePassword, __v, ...userInfo } = newUser.toObject()

    return res.status(200).json({
      message: 'user created',
      user: {
        ...userInfo
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
