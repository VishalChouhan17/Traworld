

const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
              
                if(!req.isAuthenticated()){
                      req.session.redirectUrl=req.originalUrl;//orinal url saved 
            req.flash("error","You must be logged in to modify listing");
            return   res.redirect("/login");
       }
 next();
}

module.exports.saveredirectUrl=(req,res,next)=>{
     if(req.session.redirectUrl){
          res.locals.redirectUrl=req.session.redirectUrl;
     }
     next();
}
module.exports.isOwner=async(req,res,next)=>{
         let {id}=req.params;
          let lst= await  Listing.findById(id);
          if(!lst.owner.equals(res.locals.currUser._id)){
             req.flash("error","You are not the owner of Listing ");
             return res.redirect(`/listings/${id}`);
      
          }
          next();
}

module.exports.validatelisting=(req,res,next)=>{
      let {error}=listingSchema.validate(req.body);
      if(error){
              let errmsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errmsg);
      }
      else next();
}



module.exports.validatereview=(req,res,next)=>{
      let {error}=reviewSchema.validate(req.body);
      if(error){
              let errmsg=error.details.map((el)=>el.mesage).join(",");
            throw new ExpressError(400,errmsg);
      }
      else next();
}

module.exports.isreviewauthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};