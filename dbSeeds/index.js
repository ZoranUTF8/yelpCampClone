//  SEEDS THE DATABASE



const mongoose = require("mongoose");
const cities = require("./cities");
const {
    places,
    descriptors
} = require("./seedHelpers");
const Campground = require("../models/campground");




mongoose.connect("mongodb://localhost:27017/campground_DB", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`Connection to database open`);
    })
    .catch((err) => {
        console.log(`Error in connection to local Mongodb database: ${err}`);
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    //  Delete everything
    await Campground.deleteMany({});

    // loop through the array and save it to DB
    for (let i = 0; i < 200; i++) {
        const random = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10


        const camp = new Campground({
            // My user id
            author: `6130c15a7160cd08231964e8`,
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            description: " Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum laboriosam quibusdam sed quasi recusandae ipsa ratione magnam placeat neque eius, quo temporibus atque natus, minima quaerat repudiandae laborum reiciendis. Consequatur",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random].longitude,
                    cities[random].latitude
                ]
            },
            images: [{
                    url: 'https://res.cloudinary.com/dfglx59pn/image/upload/v1631370922/Campgrounds/sgup3mtnjdjhnwopv1cu.jpg',
                    filename: 'Campgrounds/sgup3mtnjdjhnwopv1cu'
                },
                {
                    url: 'https://res.cloudinary.com/dfglx59pn/image/upload/v1631370922/Campgrounds/ehg8ejid9by6qcddempg.jpg',
                    filename: 'Campgrounds/ehg8ejid9by6qcddempg'
                }
            ]

        })

        await camp.save()
    }
    // end of for loop
}

seedDB().then(() => {
        mongoose.connection.close()
        console.log("Database conection closed")
    })
    .catch((err) => {
        console.log(`Error closing database: ${err}`);
    })