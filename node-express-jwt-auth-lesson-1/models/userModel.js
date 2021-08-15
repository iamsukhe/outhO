    const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true , "Please Enter Email"],
        unique : true,
        lowercase : true,
        validate : [(val) => { if(!validator.isEmail(val)){throw new Error ( "Please enter valid email.")} }]
    },
    password : {
        type : String, 
        required : [true , "Please Enter Password"],
        minlength : [6 , "Minimum Password length is 6"]
    }
})


// userSchema.post("save" , function(doc ,  next){
//     console.log("new user was created" , doc);
//     next()
// })


// fire a function before the document save to db
userSchema.pre("save" , async function(next){
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds)
    next();
});


userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if (user){
        const auth = await bcrypt.compare(password , user.password);
        if(auth){
            return user
        }else{
            throw Error("You entered incorrect password")
        }
    }
    throw Error("incorrect email")
}

const User = new mongoose.model("User" , userSchema)

module.exports = User