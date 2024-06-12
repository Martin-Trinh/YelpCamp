const express = require('express')
const passport = require('passport')
const router  = express.Router()

const catchAsync = require('../utils/CatchAsync')
const {storeReturnTo} = require('../middleware')
const userController = require('../controllers/user')

router.route('/register')
.get(userController.renderRegisterForm)
.post(catchAsync(userController.registerUser))

router.route('/login')
.get(userController.renderLoginForm)
.post(
    storeReturnTo,
    passport.authenticate('local', {failureFlash: true,  failureRedirect: '/login'}), 
    userController.loginUser)


router.get('/logout', userController.logoutUser)

module.exports = router