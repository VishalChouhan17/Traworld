const  express=require('express');
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const passport=require("passport");
const multer=require('multer');
  const {storage}=require("../cloudconfig.js");
  const upload=multer({storage});

router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
     validatelisting,
    wrapAsync(listingcontroller.createlisting));//callback index from controller


//new route
router.get("/new",isLoggedIn,listingcontroller.rendernew);

//show id 
router.route("/:id")
.get(wrapAsync(listingcontroller.showlisting))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validatelisting,wrapAsync(listingcontroller.updatelisting))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deletelisting))



router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.rendereditform))


module.exports=router;