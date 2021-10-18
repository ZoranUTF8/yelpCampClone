// cloudinary image upload config file

const cloudinary = require("cloudinary").v2;

const {
    CloudinaryStorage
} = require("multer-storage-cloudinary");

// associating our account with our app
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
// cloudinary storage and which fomrats are allowed
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        // folder name in cloudinary
        folder: "Campgrounds",
        allowedFormats: ["jpeg", "png", "jpg"]
    }

});


module.exports = {
    cloudinary,
    storage
}