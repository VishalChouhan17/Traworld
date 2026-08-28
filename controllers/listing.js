const Listing=require("../models/listing.js");
module.exports.index = async (req, res) => {
  try {
    // Extract 'search' from req.query to match name="search" in your form
    const { search, category } = req.query;
    let query = {};

    // 1. Text Search Across Title, Location, Country, and Description
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { description: searchRegex }
      ];
    }

    // 2. Category Filter
    if (category && category.trim() !== "") {
      query.category = category.trim();
    }

    const allListings = await Listing.find(query);

    // Pass 'search' back so the input field retains user text after submit
    res.render("listings/index.ejs", { 
      allListings, 
      searchQuery: search || "", 
      activeCategory: category || "" 
    });
  } catch (err) {
    console.error("Error fetching listings:", err);
    req.flash("error", "Cannot fetch listings at this time.");
    res.redirect("/");
  }
};
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
                        let url=   req.file.path;
                        let filename=   req.file.filename;
         const   newlisting  =new Listing( req.body.listing); 
           newlisting.owner=req.user._id;
            newlisting.image={url,filename};
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
               let originalimage=listing.image.url;
             originalimage=  originalimage.replace("/upload","/upoad/h_300,w_250");
              res.render("listings/editform",{listing});
        }
            

      module.exports.updatelisting=  async(req,res)=>{
               let {id}=req.params;
         
             let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
               if(typeof req.file!=="undefined"){
                let url=   req.file.path;
                     let filename=   req.file.filename;
                      listing.image={url,filename};
                      await listing.save();
               }

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
        