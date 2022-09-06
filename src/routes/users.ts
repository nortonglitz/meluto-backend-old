import { Router } from 'express'
import { authenticated, passwordRequired } from 'middlewares/auth'
import { createUserRegular, editUser, verifyEmail } from 'controllers/users'
import { createTemporaryUser, verifyTemporaryUserEmail, editTemporaryUser } from 'controllers/temporaryUser'
import { sendEmailCode } from 'controllers/codes/sendEmailCode'
import { sendTemporaryUserEmailCode } from 'controllers/codes/sendTemporaryUserEmailCode'
import { emailVerified } from 'middlewares/verified'
import multer from 'multer'
import { uploadTemporaryUserDocs } from 'controllers/temporaryUser/uploadTemporaryUserDocs'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4000000,
    files: 2
  }
})

router.post('/regular', createUserRegular)
router.post('/verify/email', authenticated, sendEmailCode)
router.put('/verify/email', authenticated, verifyEmail)
router.get('/logged', authenticated)
router.put('/:userId/:field', authenticated, emailVerified, passwordRequired, editUser)

/* Temporary */
router.post('/temporary/docs', upload.array('docImages', 2), uploadTemporaryUserDocs)
router.post('/temporary', createTemporaryUser)
router.put('/temporary/verify/email', verifyTemporaryUserEmail)
router.post('/temporary/verify/email', sendTemporaryUserEmailCode)
router.put('/temporary/:temporaryUserId/:field', editTemporaryUser)

export default router
