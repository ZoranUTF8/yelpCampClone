const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// Adds to our UserSchema a username and password field that are unique and some additional methods that we can use
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", UserSchema);