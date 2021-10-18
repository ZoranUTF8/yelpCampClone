const AppError = require("../Helpers/AppError");
const Campground = require("../models/campground");
const Review = require("../models/review");
//  Joi validators camp
const {
    campValidator,
    reviewValidator
} = require("../Helpers/schemas");


module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        //store required url if not logged in
        req.session.returnToUrl = req.originalUrl;

        req.flash("error", "You must be logged in.");
        res.redirect("/login");
    } else {
        next();
    }

}

// VALIDATE CAMP BEFORE SAVING TO DB MIDDLEWARE
module.exports.validateCamp = (req, res, next) => {

    const {
        error
    } = campValidator.validate(req.body);


    if (error) {
        //THROW THE ERROR WITH THE ERROR MESSAGE 
        const msg = error.details.map(el => el.message).join(", ");

        throw new AppError(msg, 400);
    } else {
        next();
    }

}
// CHECK IF USER IS OWNER OF CAMP MIDDLWARE
module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;

    const camp = await Campground.findById(id);

    if (!camp.author.equals(req.user._id)) {
        req.flash(`error`, `You are not the owner of this camp!`);
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}

// validate review before saving to db
module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewValidator.validate(req.body);

    if (error) {
        //THROW THE ERROR WITH THE ERROR MESSAGE 
        const msg = error.details.map(el => el.message).join(", ");
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

// CHECK IF USER IS OWNER OF CAMP MIDDLWARE
module.exports.isReviewAuthor = async (req, res, next) => {
    const {
        reviewId,
        id
    } = req.params;

    const review = await Review.findById(reviewId);

    if (!review.author.equals(req.user._id)) {
        req.flash(`error`, `You are not the owner of this camp!`);
        res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}