const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    show_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    total_price: {       
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'booking',
    timestamps: false
});

module.exports = Booking;