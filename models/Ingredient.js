module.exports = function(sequelize, DataTypes) {
    var Ingredient = sequelize.define("Ingredient", {
      name: {
        type: DataTypes.STRING
      },
      aisle: {
        type: DataTypes.STRING
      }
    });
  
    Ingredient.associate = function(models) {
      Ingredient.BelongsToMany(models.UserAccount, {
      });
    };
  
    
    return Ingredient;
  };
  