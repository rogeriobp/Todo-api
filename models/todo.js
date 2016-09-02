module.exports = function(sequelize, DataTypes) {
    return sequelize.define('todo', {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,250]
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                len: [1,5]
            },
            defaultValue: false
        }
    });
};