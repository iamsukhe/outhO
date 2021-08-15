const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser")
var routes = require('./routes/outhRoutes')
const {requireAuth, checkUser} = require("./middleware/authMiddleware")

const app = express();

 
// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

// view engine
app.set(  'view engine', 'ejs');



// database connection
const dbURI = 'mongodb://localhost:27017/jwtDB';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


app.get("*" , checkUser);
// routes
// ......
app.get("/" , (req,res)=>{
  res.render("home")
});

// secret route
app.get('/smoothies', requireAuth ,(req,res)=>{
  res.render("smoothies")
});

app.use('/', routes)



app.listen(8080 , ()=>{
  console.log("Server is live at 8080");
})
