const request = require('request');

module.exports = function(app) {
    app.get('/api/spoon/steps/:id', (req, res) => {
        let id = req.params.id;
        let apiKey = process.env.API_KEY;
        console.log(apiKey);
        request(`https://api.spoonacular.com/recipes/${id}/analyzedInstructions?apiKey=${apiKey}`, (err, response, body) => {
            res.send(body);
        });
    });

    app.get('/api/spoon/info/:id', (req, res) => {
        let id = req.params.id;
        let apiKey = process.env.API_KEY;
        request(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`, (err, response, body) => {
            if (err) console.error(err);
            res.send(body);
        });
    });

    app.get('/api/spoon/suggestions/:value', (req, res) => {
        let value = req.params.value;
        let apiKey = process.env.API_KEY;
        request(`https://api.spoonacular.com/food/ingredients/autocomplete?number=10&query=${value}&apiKey=${apiKey}`, (err, response, body) => {
            if (err) console.error(err);
            res.send(body);
        });
    });

    app.get('/api/spoon/byingredients/:ingredients', (req, res) => {
        let ingredients = req.params.ingredients;
        let apiKey = process.env.API_KEY;
        request(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=20&apiKey=${apiKey}`, (err, response, body) => {
            if (err) console.error(err);
            res.send(body);
        });
    });
}