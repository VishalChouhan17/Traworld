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
    url:String,
    filename:String,
    

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
  },
  geometry: {
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        default: [77.4126, 23.2599]
    }
}


});


listingSchema.post("findOneAndDelete",async function(listing){
      if(listing){
            await Review.deleteMany({_id:{$in:listing.reviews}});
      }
});




const Listing=mongoose.model("Listing",listingSchema);
   module.exports=Listing;

