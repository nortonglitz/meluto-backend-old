import { Router } from 'express'
import { getLocalByCEP } from 'controllers/maps'

const router = Router()

router.get('/cep/:CEP', getLocalByCEP)

export default router
