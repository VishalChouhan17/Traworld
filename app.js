
if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}
  
const express = require("express");
const app = express();
const mongoose =require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
const ExpressError=require("./utils/ExpressError.js");
app.use(express.static(path.join(__dirname,"/public")));
const cookieParser=require("cookie-parser");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");
 
  const flash=require("connect-flash");
 const passport=require('passport');//used for authentication
 const localStrategy=require('passport-local');//used for establishing local strategy for authentication
 const User=require("./models/user.js");
const connectDB = require("./config/db.js");

connectDB();
const session=require('express-session');
const {MongoStore}=require('connect-mongo');
  console.log(MongoStore);
  const store=MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
      secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
  })
   store.on("error",(err)=>{
     console.log("ERROR IN MONGO SESSION STORE",err);
   })
  const sessionOptions={
        store,
        secret:process.env.SECRET,
        reserve :false,
        saveUninitialized:true,
        cookie:{
              expires:Date.now()+ 7*24 * 60 * 60 *1000,
              maxAge:7*24 * 60 * 60 *1000 ,
              httpOnly:true,
        }
  }

  app.use(session(sessionOptions));
    app.use(flash());

     app.use(passport.initialize());//middleware initialize passport
     app.use(passport.session());
     passport.use(new localStrategy(User.authenticate()));
     // a web application needs ability to identify users as they browsee form page to page to identify each assciated with same user know as sessions
     passport.serializeUser(User.serializeUser());
    
     passport.deserializeUser(User.deserializeUser());
   // serialize user is used to store the user in the session and deserialize user is used to get the user from the session



app.use((req,res,next)=>{
       res.locals.success=req.flash("success");
       res.locals.error=req.flash("error");
       res.locals.currUser=req.user;
       next();
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);


app.use((err,req,res,next)=>{
      console.log(err);
      let {statuscode = 500 ,message="Something went wrong"}=err;
      res.status(statuscode).render("err.ejs",{message});

});







app.listen(8080,()=>{
       console.log("server is running at port 8080");
})




