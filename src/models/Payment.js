const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'BOOKING',
            key: 'booking_id'
        }
    },
    payment_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    payment_method: {
        type: DataTypes.STRING(30)
    },
    payment_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['Pending', 'Completed', 'Failed', 'Refunded']]
        }
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'payment',
    timestamps: false
});

module.exports = Payment;