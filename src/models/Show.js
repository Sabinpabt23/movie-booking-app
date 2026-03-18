const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Show = sequelize.define('Show', {
    show_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'MOVIE',
            key: 'movie_id'
        }
    },
    hall_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'HALL',
            key: 'hall_id'
        }
    },
    show_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    show_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    ticket_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'show',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['hall_id', 'show_date', 'show_time']
        }
    ]
});

module.exports = Show;