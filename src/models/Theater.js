const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Theater = sequelize.define('Theater', {
    theater_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    theater_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    theater_location: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
}, {
    tableName: 'theater',
    timestamps: false
});

module.exports = Theater;