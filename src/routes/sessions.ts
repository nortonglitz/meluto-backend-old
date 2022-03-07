import { Router } from 'express'
import { checkCredentials } from 'middlewares/auth'
import { createSession } from 'controllers/sessions'

const router = Router()

router.post('/:userId', checkCredentials, createSession)

export default router
