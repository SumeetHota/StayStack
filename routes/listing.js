const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../Models/listing.js");
const {isLoggedIn,isOwner,validateListing}  = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// router.route
router
  .route("/")
  // Index Route  
  .get(wrapAsync(listingController.index))
  // Create route
  .post(isLoggedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(listingController.createListing)
    );
// New Route  
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
);

router.route("/:id")
                    // Show Routes (Read Operation)
  .get(wrapAsync(listingController.showListing))
                    //Update Route
  .put(
      isLoggedIn,
      isOwner,
      upload.single("image"),
      validateListing,
      wrapAsync(listingController.updateListing))
                    //Delete Route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyedListing));


//Edit Route
router.get(
  "/:id/edit", 
  isLoggedIn,
  isOwner, 
  wrapAsync(listingController.renderEditForm)
);


module.exports= router;