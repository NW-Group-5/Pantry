const express = require("express");

//to use Heroku or listen locally
var PORT = process.env.PORT || 3030;

var app = express()

app.use(express.static("public"))

//parse as JSON
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json())

//CONTROLLER REQUIRE, change name if needed
const pantry_controller = require("./controllers/pantry_controller")
app.use(pantry_controller)

const expressHandlebars = require("express-handlebars")

app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}))

app.set("view engine", "handlebars")

app.listen(PORT, function(){
    console.log("app is listening on PORT ", PORT)
})