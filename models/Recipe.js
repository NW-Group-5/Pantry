
module.exports = function (sequelize, DataTypes) {
    var Recipe = sequelize.define("Recipe", {
        name: {
            type: DataTypes.STRING
        },
        recipeID: {
            type: DataTypes.STRING
        },
        summary: {
            type: DataTypes.STRING
        },
        imageURL: {
            type: DataTypes.STRING
        }
    });

    Recipe.associate = function (models) {
        Recipe.belongsTo(models.UserAccount, {
            
        });
    };

    return Recipe;
};
