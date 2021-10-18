const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const imageSchema = new Schema({
    url: String,
    filename: String
})
// VIRTUAL TO SIZE OUR IMAGE
imageSchema.virtual(`thumbnail`).get(function () {
    return this.url.replace(`/upload`, `/upload/w_300`)
})

// ENABLE VIRUTALS TO BE INCLUDED IN THE OBJECT
const opts = {
    toJSON: {
        virtuals: true
    }
};

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, "Campground title required (MONGODB"]
    },
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"], // has to be point always
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        required: [true, "Campground price required (MONGODB"]
    },
    description: {
        type: String,
        required: [true, "Campground description required (MONGODB"]
    },
    location: {
        type: String,
        required: [true, "Campground location required (MONGODB"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, opts);


// VIRTUAL FOR CAMP DATA TO CLUSTER MAP
campgroundSchema.virtual('properties.popUpText').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>
    `;
})




// Post deleting middleware 
campgroundSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        // use the review id from the deleted camp and remove it from reviews as well
        const result = await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    } else {
        console.log(`Error from deletion reviews:${result}`);
    }
})


// Exporting the model
module.exports = mongoose.model("Campground", campgroundSchema);