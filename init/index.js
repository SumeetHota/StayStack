const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

// --------------------------------------------------- //
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 
main()
    .then(()=>{
    console.log("connect to DB.")
})
    .catch((err)=>{
    console.log(err);
});
async function main(){
  await mongoose.connect(MONGO_URL);
}
// --------------------------------------------------- // 

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj)=> ({...obj, owner: "697a1b2d4d2f4f74e69e95a0"}));
    await Listing.insertMany(initData.data);
    console.log("data was initializes.");  
};

initDB();