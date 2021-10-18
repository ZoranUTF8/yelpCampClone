if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}



// const localMongoDb = "mongodb://localhost:27017/campground_DB"; // local db
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const AppError = require("./Helpers/AppError");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// prevent mongo injection
const mongoSanitize = require('express-mongo-sanitize');
// helmet security
const helmet = require("helmet");
// Authentication session
const session = require('express-session');

// storing session information on db instead memory store
const MongoStore = require('connect-mongo');
const dbUrl = process.env.ATLAS_URL // atlas db or local db

const secret = process.env.SECRET || "developmentSecret";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret,
    }
});

store.on("error", function (err) {
    console.log("STORE ERROR")
})
//  session config

const sessionConfig = {
    store,
    name: "sessionSnack", // cookies name
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // no acces to cookies through js
        //secure: true, // only ON when deployed as localhost is not https secure
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// express-session
app.use(session(sessionConfig))




// MODELS IMPORT
const User = require("./models/user");

// Router imports
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

// CUSTOM CONFIG 
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({
    extended: true
}))
app.use(methodOverride("_method"));
// to use static files 
app.use(express.static(path.join(__dirname, "public")));
// mongo injection prevention
// replaces $ with udnerscore
app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);
// flash messages
app.use(flash());
// helmet 
app.use(helmet());

// restricts the locations where we can fetch resources, and if the url are not added than we cannot acces them
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",

];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dfglx59pn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://source.unsplash.com/collection/3444494/1600x900",
                "https://source.unsplash.com/collection/1114848"
            ]
        },
    })
);


// Authentication with passport
app.use(passport.initialize());
app.use(passport.session());
// use the local strategy with the authenticate method located in our User model that is coming from passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
// How do we store a user in the session
passport.serializeUser(User.serializeUser());
// How to unstore the user in the session
passport.deserializeUser(User.deserializeUser());

// ALL ACCESS IN TEMPLATES ***
app.use((req, res, next) => {
    console.log(req.query)
    // current user id
    res.locals.currentUser = req.user;
    // flash messages all acces
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();
})

// ROUTER SETUP

app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
    res.render("home");
});



// MONGO DB LOCAL CONFIG before deplyoing
mongoose.set('useFindAndModify', false);
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`Connection to database open`);
    })
    .catch((err) => {
        console.log(`Error in connection to local Mongodb database: ${err}`);
    })

// ERROR HANDLER MIDDLEWARE
app.all("*", (req, res, next) => {
    // when we call next it goes to the error handler below
    next(new AppError("Page not found", 404))
});

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    res.status(statusCode).render("campgrounds/fail", {
        err
    });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
// app.listen(3000, () => {
//     console.log(`Server port ${port}`);
// })