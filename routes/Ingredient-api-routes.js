var db = require("../models");

module.exports = function (app) {

    // GET route for retreiving ingredients
    app.get("/api/Ingredients/", function (req, res) {
        db.Ingredient.findAll({
            where: {
                UserAccountID: UserAccountID
            }
        })
            .then(function (dbIngredient) {
                res.json(dbIngredient);
            });
    });
    // POST route for adding ingredients
    app.post("/api/Ingredients", function (req, res) {
        db.Ingredient.create({
            name: req.body.name,
            aisle: req.body.aisle,
            UserAccountId: req.body.UserAccountId
        })
            .then(function (dbIngredient) {
                res.json(dbIngredient);
            });
    });
    // DELETE route for deleting ingredients
    app.delete("/api/Ingredients/:id", function (req, res) {
        db.Post.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(function (dbIngredient) {
                res.json(dbIngredient);
            });
    });
}
