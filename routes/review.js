const  express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
 const {validatereview,isLoggedIn,isreviewauthor}=require("../middleware.js");
 
  const reviewcontroller=require("../controllers/review.js");




//post route for reviews
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewcontroller.createreview));
//delete route for reviews
router.delete("/:reviewId",isLoggedIn,isreviewauthor,wrapAsync(reviewcontroller.deletereview));


module.exports=router;