const  express=require('express');
const mongoose=require('mongoose');
const Schema =mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;

const userSchema=new Schema({
    email:{
          type:String ,
          required:true,
    }

})

//we do not need to add username and password and hashing and salting field as passport local mongoose will add it for us
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
