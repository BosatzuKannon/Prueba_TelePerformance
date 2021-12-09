const express = require('express')
const router = express.Router()
const multipart = require('connect-multiparty')

const md_auth = require('../../middlewares/authenticated')
const md_upload_avatar = multipart({uploadDir: "./uploads/avatar"})

const UserController = require('../../controllers/users/user')

router.get('/getAvatar/:avatarName',UserController.getAvatar)

router.post('/sing-up',UserController.signUp)
router.post('/sing-in',UserController.signIn)

router.put('/upAvatar/:id',[md_auth.ensureAuth, md_upload_avatar],UserController.uploadAvatar)
router.put('/upUser/:id',[md_auth.ensureAuth],UserController.updateUser)
router.put('/actUser/:id',[md_auth.ensureAuth],UserController.activateUser)

router.delete('/delUser/:id',[md_auth.ensureAuth],UserController.deleteUser)

module.exports = router