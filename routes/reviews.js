const express = require("express");
// merge params *important when we use  the router with :id 
const router = express.Router({
    mergeParams: true
});
const catchAsync = require("../Helpers/wrapAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");

const {
    validateReview,
    isLoggedIn,
    isReviewAuthor
} = require("../Helpers/helperMiddlware")

// controller
const reviews = require("../controllers/reviews");




// LEAVE A REVIEW
router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));


// DELETE REVIEW FROM CAMPGROUND USING THE $PULL OPERATOR
router.delete("/:reviewId", isReviewAuthor, isLoggedIn, catchAsync(reviews.deleteReview))




module.exports = router;