const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { check } = require("express-validator");

const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt;

    //check jwt exist or not 

    if (token) {
        jwt.verify(token, "sukhesingh", (err, decodeToken) => {
            if (err) {
                console.log(err.message)
                res.redirect("/login")
            } else {
                // console.log(decodeToken)
                next()
            }
        })
    } else {
        res.redirect("/login")
    }
}

// check current user

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "sukhesingh", async (err, decodeToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null;
                next();
            } else {
                //console.log(decodeToken)
                let user = await User.findById({ _id: decodeToken.id });
                res.locals.user = user
                next()
            }
        })
   
    } else {
        res.locals.user = null;
        next();
    }
}


const admin = (method) => {
    switch (method) {
      case "login": {
        return [
          check("email", "Invalid is email").isEmail(),
          check("password", "Password is required").not().isEmpty(),
        ];
      }
      default: {
        return [];
      }
    }
  };


module.exports = { requireAuth , checkUser , admin}