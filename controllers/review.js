
  const Listing=require("../models/listing");
  const Review=require("../models/review");



module.exports.createreview=async(req,res)=>{
      let {id}=req.params;
      const listing= await Listing.findById(id);
      if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
      }
      const review=new Review(req.body.review);
        review.author=req.user._id;
      listing.reviews.push(review);
      await review.save();
      await listing.save();
       req.flash("success","New Review Created");
      res.redirect(`/listings/${id}`);
}

module.exports.deletereview=async(req,res)=>{
    
      let {id,reviewId}=req.params;
      const review = await Review.findById(reviewId);
      if (review.author.toString() !== req.user._id.toString()) {
            req.flash("error", "You don't have permission to delete this review");
            return res.redirect(`/listings/${id}`);
      }
      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
       req.flash("success"," Review Deleted")
      res.redirect(`/listings/${id}`);
}