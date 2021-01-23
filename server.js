const express = require("express");

const session = require("express-session")

//to use Heroku or listen locally
var PORT = process.env.PORT || 3030;

var app = express()

app.use(express.static("public"))

//parse as JSON
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

var passport = require("./config/passport");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

require("./routes/html-routes.js")(app);
require("./routes/Ingredient-api-routes.js")(app);
require("./routes/UserAccount-api-routes.js")(app);



//CONTROLLER REQUIRE, change name if needed
// const pantry_controller = require("./controllers/pantry_controller")
// app.use(pantry_controller)

const expressHandlebars = require("express-handlebars")

app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}))

app.set("view engine", "handlebars")

//require models
const db = require("./models")



//use sequeliize when starting express app
db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});