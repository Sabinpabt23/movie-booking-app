const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hall = sequelize.define('Hall', {
    hall_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    theater_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'THEATER',
            key: 'theater_id'
        }
    },
    hall_number: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    hall_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, {
    tableName: 'hall',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['theater_id', 'hall_number']
        }
    ]
});

module.exports = Hall;