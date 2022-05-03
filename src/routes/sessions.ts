import { Router } from 'express'
import { createSession } from 'controllers/sessions'

const router = Router()

router.post('/:userId', createSession)
router.post('/renew')

export default router
