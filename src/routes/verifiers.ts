import { Router } from 'express'
import { sendPhoneCode, sendEmailCode, validateEmailCode, validatePhoneCode } from 'controllers/verifiers'

const router = Router()

/* E-mail */
router.post('/email', sendEmailCode)
router.put('/email', validateEmailCode)

/* Phone */
router.post('/phone', sendPhoneCode)
router.put('/phone', validatePhoneCode)

export default router
