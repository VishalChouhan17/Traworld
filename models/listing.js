const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const Review=require("./review.js");

let listingSchema =new Schema({
  category: {
  type: String,
  enum: [
    "Trending",
    "Rooms",
    "Iconic cities",
    "Mountains",
    "Castles",
    "Amazing pools",
    "Camping",
    "Farm",
    "Arctic",
    "Beach",
    "Monuments"
  ]
},
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
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],  //[Longitude, Latitude]
      required: true,
    },
  },


});


listingSchema.post("findOneAndDelete",async function(listing){
      if(listing){
            await Review.deleteMany({_id:{$in:listing.reviews}});
      }
});




const Listing=mongoose.model("Listing",listingSchema);
   module.exports=Listing;

