var db = require("../models");

module.exports = function (app) {

    // GET route for retreiving ingredients
    app.get("/api/Recipe/", function (req, res) {
        db.Recipe.findAll({
            where: {
                UserAccountID: UserAccountID
            }
        })
            .then(function (dbPost) {
                res.json(dbPost);
            });
    });

}