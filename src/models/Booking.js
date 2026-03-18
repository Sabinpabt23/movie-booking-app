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
        allowNull: false,
        references: {
            model: 'USER',
            key: 'user_id'
        }
    },
    show_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SHOW',
            key: 'show_id'
        }
    },
    booking_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'booking',
    timestamps: false
});

module.exports = Booking;