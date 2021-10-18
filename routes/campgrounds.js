const express = require("express");
const router = express.Router();
const catchAsync = require("../Helpers/wrapAsync");

// for uploading multipart files, form for image  upload
const multer = require("multer");
// stores  files localy
// const upload = multer({dest: "uploads/"});
// cloudinary storage object
const {storage} = require("../cloudinary");
// upload to our cloudinary account
const upload = multer({storage});




//  custom middlwere imports
const {
    isLoggedIn,
    validateCamp,
    isAuthor
} = require("../Helpers/helperMiddlware");
// campground controller imports
const campgrounds = require("../controllers/campgrounds");



router.route("/")
    .get(catchAsync(campgrounds.index)) // LIST ALL CAMPGROUNDS
    
    .post(isLoggedIn, upload.array("image"),validateCamp , catchAsync(campgrounds.createCamp)); // CREATE A NEW CAMPGROUND

router.get("/new", isLoggedIn, campgrounds.newForm); // RENDER NEW CAMP FORM

router.route("/:id")
    .get(catchAsync(campgrounds.showDetails)) // LIST CAMPGROUND DETAILS
    .put(isLoggedIn, isAuthor, upload.array(`image`),validateCamp, catchAsync(campgrounds.editCamp)) // EDIT CAMPGROUND
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp)); // DELETE CAMP

// EDIT CAMPGROUND
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editCampForm));

// FAIL PAGE
router.get("/fail", campgrounds.failPage);

module.exports = router;