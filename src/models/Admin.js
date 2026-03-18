const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
    admin_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    admin_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    admin_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    admin_password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    admin_role: {
        type: DataTypes.STRING(20),
        defaultValue: 'super_admin'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'ADMIN',
    timestamps: false
});

module.exports = Admin;