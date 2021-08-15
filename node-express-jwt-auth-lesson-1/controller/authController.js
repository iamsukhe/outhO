
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");

const handleErrors = (err)=>{
    console.log(err.message)                        
    let error = {email: "" , password : ""};

    if(err.message==="incorrect password"){
        error.password = "password incorrect"
    }
    else if(err.message==="incorrect email"){
        error.email = "Email does not exist"
    }

    if(err.message.includes("User validation failed")){
        // console.log(err.errors)
        // Object.values(err.errors).forEach(({properties})=>{
        //     error[properties.path] = properties.message
        // })
        Object.values(err.errors).forEach((val)=>{
            error[val.properties.path] = val.properties.message
        })
    }
    return error;
}
const maxAge = 3*24*60*60;
const createToken = (id)=>{
    return jwt.sign({id} , "sukhesingh" , {
        expiresIn : maxAge
    } )
}

const signup_get = (req, res) => {
    res.render("signup")
}

const login_get = (req, res) => {
    res.render("login")
}

const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {

        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({error : { email: "Email already Exist" }})
        } 
            const user = await User.create({ email, password })
            const token = createToken(user._id);
            res.cookie("jwt" , token , {httpOnly : true , maxAge : maxAge*1000})
            if (user) {
                res.status(201).json({ userId : user._id })
            }
        
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(500).json({errors})
    }


}

const login_post = async (req, res) => {
    try {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = { ...errors };
            err_msgs.errors.forEach((err) => errs.push(err.msg));
            return res.status(200).json({ status: false, msg: errs, data: null });
        }
        const { email, password } = req.body;
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt" , token , {httpOnly : true , maxAge : maxAge*1000})
        res.status(200).json({userId : user._id})
    } catch (e) {
        console.log(e.message)
        return res.status(200).json({ status: false, msg: e.message, data: null });
    }

}


const logout_get = async (req, res) => {
    res.cookie("jwt" , "" , {maxAge : 1})
    res.redirect("/")
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
}