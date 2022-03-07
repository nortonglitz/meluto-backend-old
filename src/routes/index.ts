import { Router } from 'express'
import users from './users'
import sessions from './sessions'

const router = Router()

router.use('/users', users)
router.use('/sessions', sessions)

export default router
