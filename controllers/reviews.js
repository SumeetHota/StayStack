const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");

//Create a riview route
module.exports.createReview = async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReviews = new Review(req.body.review);
  newReviews.author = req.user._id;
  listing.reviews.push(newReviews);
   
  await newReviews.save();
  await listing.save();
  req.flash("success", "New Review created.");
  res.redirect(`/listings/${listing._id}`)
};

// Delete  Review route
module.exports.destroyReview = async(req,res)=>{
  let {id, reviewId}= req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted.");
  res.redirect(`/listings/${id}`);
};

