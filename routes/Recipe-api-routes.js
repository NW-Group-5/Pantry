var db = require("../models");

module.exports = function (app) {

    // GET route for retreiving recipes
    app.get("/api/Recipes/", function (req, res) {
        db.Recipe.findAll({
            where: {
                UserAccountID: UserAccountID
            }
        })
            .then(function (dbRecipe) {
                res.json(dbRecipe);
            });
    });
    // POST route for adding recipes
    app.post("/api/Recipes", function (req, res) {
        db.Recipe.create({
            name: req.body.name,
            recipeID: req.body.recipeID,
            summary: req.body.summary,
            imageURL: req.body.imageURL
        })
            .then(function (dbRecipe) {
                res.json(dbRecipe);
            });
    });
}

