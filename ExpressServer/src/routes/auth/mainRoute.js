const express = require('express');
const router = express.Router();

const userRoute = require('./auth')

router.use('/auth',userRoute)

module.exports = router;