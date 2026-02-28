const mongoose =require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:  {
       type: String, 
       require:true,
    }, 
    description:{
        type:String,
    },
    image:{
        filename:String,   //{type:String,default:"https://unsplash.com/photos/a-lone-tree-stands-in-the-middle-of-a-lake-psHupHnt2gw"},
        url: String        //{type: String, default:"https://unsplash.com/photos/a-lone-tree-stands-in-the-middle-of-a-lake-psHupHnt2gw", set:(v) => v === ""? "https://unsplash.com/photos/a-lone-tree-stands-in-the-middle-of-a-lake-psHupHnt2gw" : v,}   
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    location: String, 
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});    
    }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;