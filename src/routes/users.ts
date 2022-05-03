import { Router } from 'express'
import { authenticated, passwordRequired } from 'middlewares/auth'
import { createUser, editUser } from 'controllers/users'

const router = Router()

router.post('/', createUser)
router.put('/:userId/:field', authenticated, passwordRequired, editUser)

export default router
