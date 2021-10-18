const Campground = require("../models/campground");
const Review = require("../models/review");


module.exports.deleteReview = async (req, res) => {
    const {
        reviewId,
        id
    } = req.params;

    //  find and pull the r eview
    const camp = await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    // delete the review from reviews
    const review = await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully deleted review.");

    res.redirect(`/campgrounds/${id}`)
};

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // set the  review user id to the current user id
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`)
};