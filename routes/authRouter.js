const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')


//login get router
router.get('/login', authController.login_get)

//login post router
router.post('/login', authController.login_post)


//signup get router
router.get('/signup', authController.signup_get)

//signup post router
router.post('/signup', authController.signup_post)

//logout router
router.get('/logout', authController.logout_get)

module.exports = router
