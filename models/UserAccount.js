var bcrypt = require("bcryptjs")
module.exports = function (sequelize, DataTypes) {
    var UserAccount = sequelize.define("UserAccount", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
        //where you can include validation
    })

    

    // associate UserAccount with Ingredient and Recipe
    UserAccount.associate = function (models) {
        UserAccount.hasMany(models.Ingredient, {
        });
        UserAccount.hasMany(models.Recipe, {
        });
    };



    //Password hashing
    // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
    UserAccount.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };
    // Hooks are automatic methods that run during various phases of the User Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    UserAccount.addHook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    return UserAccount
}