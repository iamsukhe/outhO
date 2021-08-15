const express = require('express')
const router = express.Router()
const controller = require("../controller/authController")
const {admin} = require("../middleware/authMiddleware")


// define the signup page route
router.get('/signup', controller.signup_get)

router.post('/signup', controller.signup_post )


  // define the about page route
router.get('/login' ,controller.login_get )

router.post('/login', admin("login") , controller.login_post )

// log out
router.get('/logout', controller.logout_get )

  


module.exports = router

