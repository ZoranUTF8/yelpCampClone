const User = require("../models/user");




module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

module.exports.registerUser = async (req, res, next) => {
    try {
        const {
            username,
            email,
            password
        } =
        req.body;

        const newUser = new User({
            username,
            email
        });

        // saves the user to db and hashes/salts the password
        const registeredUser = await User.register(newUser, password);

        // log in the user after registering
        req.login(registeredUser, err => {
            if (err) {
                next(err)
            } else {
                req.flash("success", "Welcome to campsite!")
                res.redirect("/campgrounds");
            }

        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("register");
    }

};

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.userLogin = (req, res) => {
    req.flash("success", "Welcome back!");
    //where to redirect the user after login
    const redirectTo = req.session.returnToUrl || "/campgrounds";
    // delete the returnToUrl from the session after redirecting to it
    delete req.session.returnToUrl
    res.redirect(redirectTo);
};

module.exports.renderLogout = (req, res) => {
    req.logout();
    req.flash("success", "Logged out.");
    res.redirect("/campgrounds");
};