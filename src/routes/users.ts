import { Router } from 'express'
import { createUser, editUser } from 'controllers/users'

const router = Router()

router.post('/', createUser)
router.put('/:userId/:field', editUser)

export default router
