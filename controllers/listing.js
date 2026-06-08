const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({});//listings is collection of all the documents in the listing collection
             res.render("listings/index.ejs",{allListings});
       

}

module.exports.rendernew=(req,res)=>{
      res.render("listings/new")}


      module.exports.showlisting=async(req,res)=>{
            let {id}=req.params;
           const listing=  await Listing.findById(id).populate({
         path: "reviews",
         populate:{
             path:"author",
         }
      }).populate("owner");
      
        if(!listing){req.flash("error","The listing you trying to access doesn't exist");
            return   res.redirect("/listings");
      
        }
          
           res.render("listings/show.ejs",{listing}) ;
      
      }

      module.exports.createlisting=async(req,res)=>{
              
         const   newlisting  =new Listing( req.body.listing); 
           newlisting.owner=req.user._id;
         await newlisting.save();
            req.flash("success","New listing created !");
             res.redirect("/listings");
      
               }

        module.exports.rendereditform=async(req,res)=>{
              let {id}=req.params;
                let listing=await Listing.findById(id);
                 if(!listing){
                  req.flash("error","The listing you are trying to edit doesn't exist");
                  return res.redirect("/listings");
              }
              res.render("listings/editform",{listing});
        }
            

      module.exports.updatelisting=  async(req,res)=>{
               let {id}=req.params;
         
             let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
              //copy all  feilds from req.body.listing and update the listing with id
               if(!listing){req.flash("error","The listing you trying to access doesn't exist");
             return   res.redirect("/listings"); 
        
          }
              req.flash("success","Listing Updated")
           res.redirect(`/listings/${id}`);
        
        
        }

        module.exports.deletelisting=async(req,res)=>{
                   let {id}=req.params;
                   await Listing.findByIdAndDelete(id);
                         req.flash("success","listing deleted !");
                   res.redirect("/listings");
        }
        