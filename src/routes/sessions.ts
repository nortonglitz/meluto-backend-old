import { Router } from 'express'
import { createSession, refreshSession, endSession } from 'controllers/sessions'
import { authenticated, checkCredentials } from 'middlewares/auth'

const router = Router()

router.post('/', checkCredentials, createSession)
router.get('/refresh', authenticated, refreshSession)
router.get('/logout', endSession)

export default router
