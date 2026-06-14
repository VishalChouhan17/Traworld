const express = require("express");
const app = express();
const path=require("path");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const session =require("express-session");
const flash=require("connect-flash");
app.get("/",(req,res)=>{ res.send("hi i am root") });
app.use("/users",users);
app.use("/posts",posts);
app.use(flash());
const sessionOptions={
     secret:"mysupersecretstring",
     reserve:false,
     saveuninitialized:true,
}

app.use(session(sessionOptions));
app.use((req,res,next)=>{
       res.locals.successmsg=req.flash("success");
       res.locals.errmsg=req.flash("error");
       next();
})
app.get("/register",(req,res)=>{
     const {name="anonymous"}=req.query;
     req.session.name=name;
     console.log(req.session.name);
      if(name==="anonymous")req.flash('error','user not registered');
    else  req.flash('success','user registered successfully');
     res.redirect("/hello");
})
app.get("/hello",(req,res)=>{  const name=req.session.name;
       
       res.render("page.ejs",{name:req.session.name});
})


app.listen(3000,()=>{
     console.log("server is listening at port 3000");
})