import { Router } from 'express'
import { getLocalByCEP } from 'controllers/maps'

const router = Router()

router.post('/cep/:cep', getLocalByCEP)

export default router
