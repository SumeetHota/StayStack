const Listing = require("../Models/listing.js");

// Index Routes
module.exports.index = async(req,res)=>{
   const allListings =  await Listing.find({});
   res.render("index.ejs",{allListings});
};

// new route
module.exports.renderNewForm = (req, res) =>{
  res.render("new.ejs");
};

// Show Routes (Read Operation)
module.exports.showListing = async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
          path:"author",
        },
      })
      .populate("owner");

    if(!listing){
      req.flash("error", "Listing you requested  for does not exist!");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("show.ejs", {listing});
};

// Create route
module.exports.createListing = async (req, res, next) => {
  let url= req.file.path;
  let filename= req.file.filename;  
  const newListing = new Listing(req.body.listing);
  newListing.owner =req.user._id;
  newListing.image ={url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}  

//Edit Route  
// module.exports.renderEditForm = async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("edit.ejs", { listing });
// };

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

  res.render("edit.ejs", { listing,originalImageUrl });
};

//Update Route
module.exports.updateListing = async (req, res) =>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(req.file){
      let url= req.file.path;
      let filename= req.file.filename;
      listing.image = {url, filename};
      await listing.save();
    }
    req.flash("success", "Listing Updated");
    return res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.destroyedListing = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success","Message Deleted");
  res.redirect("/listings");
};

