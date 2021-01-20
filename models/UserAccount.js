module.exports = function(sequelize, DataTypes) {
    var UserAccount = sequelize.define("UserAccount", {
    name: DataTypes.STRING
    //where you can include validation
    })

    

    return UserAccount
}