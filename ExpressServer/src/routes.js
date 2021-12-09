const express = require('express')
const router = express.Router()

const userRoute = require('./routes/users/mainRoute')
const authRoute = require('./routes/auth/mainRoute')

router.use('/users',userRoute)
router.use('/auth', authRoute)

module.exports = router