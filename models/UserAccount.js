module.exports = function(sequelize, DataTypes) {
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
    //add more for passport
    })


    // associate UserAccount with Ingredient and Recipe
    UserAccount.associate = function(models) {
        UserAccount.hasMany(models.Ingredient, {
        });
        UserAccount.hasMany(models.Recipe, {
        });
      };


    return UserAccount
}