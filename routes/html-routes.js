//Code from section 14 homework

// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

const db = require('../models');

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

    app.get("/", function (req, res) {
        // If the user already has an account send them to the pantry page
        if (req.user) {
            db.Ingredient.findAll({
                where: {
                    UserAccountID: req.user.id
                }
            })
            .then(function (ingredients) {
                db.Recipe.findAll({
                    where: {
                        UserAccountID: req.user.id
                    }
                })
                .then(function (recipes) {
                    res.render('pantry', {ingredients: ingredients, recipes: recipes});
                });
            });
        };

        res.sendFile(path.join(__dirname, "../public/html/index.html"));
    });

    app.get("/signup", function (req, res) {

        res.sendFile(path.join(__dirname, "../public/html/signup.html"));
    });

    //route with handlebars
    app.get("/pantry/:id", isAuthenticated, function (req, res) {
        if (+req.user.id !== +req.params.id) {
            res.redirect(`/pantry/${req.user.id}`);
        };

        db.Ingredient.findAll({
            where: {
                UserAccountId: req.params.id
            }
        })
        .then(function (ingredients) {
            db.Recipe.findAll({
                where: {
                    UserAccountId: req.params.id
                }
            })
            .then(function (recipes) {
                res.render('pantry', {ingredients: ingredients, recipes: recipes});
            });
        });
    });

};
