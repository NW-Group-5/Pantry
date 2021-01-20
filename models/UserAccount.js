module.exports = function(sequelize, DataTypes) {
    var UserAccount = sequelize.define("UserAccount", {
    username: DataTypes.STRING,
    password: DataTypes.STRING
    //where you can include validation
    })

    //associate UserAccount with UserPantry
    UserAccount.associate = function(models) {

        UserAccount.HasOne(models.userPantry), {
            onDelete: "cascade"
        }
    }

    return UserAccount
}