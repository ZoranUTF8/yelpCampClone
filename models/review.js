const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    text: {
        type: String,
        required: [true, "Review text required (MONGODB"]
    },
    rating: {
        type: Number,
        required: [true, "Rating required (MONGO DB"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);