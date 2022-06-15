import { Router } from 'express'
import users from './users'
import sessions from './sessions'
import maps from './maps'

const router = Router()

router.use('/users', users)
router.use('/sessions', sessions)
router.use('/maps', maps)

export default router
