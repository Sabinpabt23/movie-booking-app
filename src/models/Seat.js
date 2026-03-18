const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Seat = sequelize.define('Seat', {
    seat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hall_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'HALL',
            key: 'hall_id'
        }
    },
    seat_number: {
        type: DataTypes.STRING(5),
        allowNull: false
    }
}, {
    tableName: 'seat',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['hall_id', 'seat_number']
        }
    ]
});

module.exports = Seat;