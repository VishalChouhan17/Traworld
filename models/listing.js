const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const Review=require("./review.js");

let listingSchema =new Schema({
  title:{
    type:String,
    required:true,


  },
  description :{
     type:String,

      required:true,
  },
  image:{
    type:String,

   default: "https://tse3.mm.bing.net/th/id/OIP.9l1kH5UpL_ogMu6fIPnypAHaFb?pid=Api&P=0&h=180",
    
     set: (v)=>v===""?"https://tse3.mm.bing.net/th/id/OIP.9l1kH5UpL_ogMu6fIPnypAHaFb?pid=Api&P=0&h=180":v,


  },
  price :{
  type:Number,
  required:true,
  },
  location :{
    type:String,
    required:true,

  },
  country :{
      type:String,
 required:true,

  },
  reviews:[{
      type:Schema.Types.ObjectId,
      ref:"Review",
  }] ,
  owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
  }


});


listingSchema.post("findOneAndDelete",async function(listing){
      if(listing){
            await Review.deleteMany({_id:{$in:listing.reviews}});
      }
});




const Listing=mongoose.model("Listing",listingSchema);
   module.exports=Listing;

