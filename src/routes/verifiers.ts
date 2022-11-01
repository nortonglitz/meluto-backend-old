import { Router } from 'express'
import { sendPhoneCode, sendEmailCode } from 'controllers/verifications'

const router = Router()

/* E-mail */
router.post('/email', sendEmailCode)

/* Phone */
router.post('/phone', sendPhoneCode)

export default router
