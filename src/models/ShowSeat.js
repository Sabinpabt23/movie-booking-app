const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShowSeat = sequelize.define('ShowSeat', {
    show_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'SHOW',
            key: 'show_id'
        }
    },
    seat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'SEAT',
            key: 'seat_id'
        }
    },
    status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            isIn: [['available', 'selected', 'booked']]
        }
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'BOOKING',
            key: 'booking_id'
        }
    },
    selected_session_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    selected_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'show_seat',
    timestamps: false
});

module.exports = ShowSeat;