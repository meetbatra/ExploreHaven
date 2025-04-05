const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl, isLoggedIn, validateBooking, validateDateRange, isNotOwner, checkUser } = require('../middleware.js');
const userController = require('../controllers/users.js');

router.route('/signup')
.get(userController.renderSignupForm)
.post(userController.signup);

router.route('/login')
.get(userController.renderLoginForm)
.post(checkUser, saveRedirectUrl, passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), userController.login);

router.get('/logout', userController.logout);

router.get('/dashboard', isLoggedIn, userController.dashboard);

router.route('/booking/:id')
.get(isLoggedIn, userController.renderBookingForm)
.post(isLoggedIn, validateBooking, validateDateRange, isNotOwner, userController.booking)

module.exports = router;