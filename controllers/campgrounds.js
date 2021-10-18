const Campground = require("../models/campground");
const {
    cloudinary
} = require("../cloudinary");
// MAPBOX
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({
    accessToken: mapBoxToken
});




const index = async (req, res) => {
    const all_campgrounds = await Campground.find({})
    res.render("campgrounds/index", {
        all_campgrounds
    })
};

const newForm = (req, res) => {
    res.render("campgrounds/newCampground")
};
const homePage = (req, res) => {
    res.render("campgrounds/home")
};


// NEW CAMP
const createCamp = async (req, res, next) => {

    // geocoding
    const geoData = await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();

    // COORDINATES IN GEOJSON FORMAT  console.log(geoData.body.features[0].geometry)

    const newCamp = new Campground(req.body.campground);
    // add the geo data json
    newCamp.geometry = geoData.body.features[0].geometry;
    // add the currently logged in user as the id
    newCamp.author = req.user._id;
    // add uploaded image links to the current camp images  array
    newCamp.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));

    await newCamp.save();

    // message for success for creating a camp
    req.flash("success", "Successfully created a new camp!");
    res.redirect(`/campgrounds/${newCamp._id}`)

};

const showDetails = async (req, res) => {

    const foundCamp = await Campground.findById(req.params.id).populate({
        // populate all the authors of the reviews, and all reviews from the campground
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");

    if (!foundCamp) {
        req.flash("error", "Camp not available.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {
        foundCamp
    })
}

const editCampForm = async (req, res) => {

    const {
        id
    } = req.params;


    const foundCamp = await Campground.findById(id);

    if (!foundCamp) {
        req.flash("error", "Camp not available.");
        return res.redirect("/campgrounds");
    } else {
        res.render("campgrounds/editCampground", {
            foundCamp
        })
    }
};

const editCamp = async (req, res) => {
    const {
        id
    } = req.params;

    console.log(req.body)


    const editedCamp = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });

    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));

    editedCamp.images.push(...imgs);

    editedCamp.save();

    // delete checked images from mongo
    if (req.body.deleteImages) {
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                cloudinary.uploader.destroy(filename)
            }
        }
        await editedCamp.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        })

    }


    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${editedCamp._id}`)

};

const deleteCamp = async (req, res) => {
    const {
        id
    } = req.params

    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground.");
    res.redirect("/campgrounds")

};

const failPage = (req, res) => {
    res.render("campgrounds/fail")
};

module.exports = {
    index,
    newForm,
    createCamp,
    showDetails,
    editCampForm,
    editCamp,
    deleteCamp,
    failPage,
    homePage
}