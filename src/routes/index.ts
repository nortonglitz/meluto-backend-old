import { Router } from 'express'
import users from './users'
import sessions from './sessions'
import maps from './maps'
import verifiers from './verifiers'

const router = Router()

router.use('/users', users)
router.use('/sessions', sessions)
router.use('/maps', maps)
router.use('/verifiers', verifiers)

export default router
