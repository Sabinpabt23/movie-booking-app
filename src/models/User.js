const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    user_password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    user_phone: {
        type: DataTypes.STRING(20)
    },
    user_dob: {
    type: DataTypes.DATE,
    allowNull: true
    },
    user_reg_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    
    profile_picture: {
    type: DataTypes.TEXT,
    allowNull: true
},
    is_locked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
}

    
}, {
    tableName: 'user',
    timestamps: false
});

module.exports = User;