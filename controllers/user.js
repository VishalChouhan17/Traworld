
  const User=require("../models/user.js");

module.exports.rendersignupform=(req,res)=>{
     res.render("users/signup.ejs")}

module.exports.signup=async(req,res,next)=>{
      let  {username,email,password}=req.body;
      const newuser=new User({email,username});
    const registereduser= await  User.register(newuser,password);
   
    req.login(registereduser,(err)=>{
        if(err)return next(err);
        req.flash("success","Welcome to Traworld");
    res.redirect("/listings");

    })
   
   
    }


    module.exports.renderloginform=(req,res)=>{
                  res.render("users/login.ejs");
    
   }
   

   module.exports.login=async(req, res)=>{
        req.flash("success","Welcome back to Traworld!");  
        let redirecturl=res.locals.redirectUrl ||"/listings";   
    res.redirect(redirecturl);

  }


  module.exports.logout=(req,res,next)=>{
      req.logout((err)=>{
          if(err){
            return  next(err);
          }
          req.flash("success","you are logged out  ");
          res.redirect("/listings");
      })


  }
