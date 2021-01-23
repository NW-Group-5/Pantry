var db = require("../models");

module.exports = function (app) {

    // GET route for retreiving ingredients
    app.get("/api/Ingredients/", function (req, res) {
        db.Ingredient.findAll({
            where: {
                UserAccountID: UserAccountID
            }
        })
            .then(function (dbPost) {
                res.json(dbPost);
            });
    });

}