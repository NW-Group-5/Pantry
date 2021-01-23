//Code from section 14 homework

// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

    app.get("/", function (req, res) {
        // If the user already has an account send them to the pantry page
        if (req.user) {
            console.log(req.user)
            res.redirect("/pantry");
        }
        res.sendFile(path.join(__dirname, "../public/html/index.html"));
    });

    app.get("/signup", function (req, res) {

        res.sendFile(path.join(__dirname, "../public/html/signup.html"));
    });

    // Here we've add our isAuthenticated middleware to this route.
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    app.get("/pantry", isAuthenticated, function (req, res) {
        res.sendFile(path.join(__dirname, "../public/pantry.html"));
    });

    //route with handlebars
    app.get("/pantry", isAuthenticated, function (req, res) {
        db.Ingredient.findAll({
            where: {
                UserAccountID: UserAccountID
            }
        })
            .then(function (dbPost) {
                res.json(dbPost);
            });
    })

};
