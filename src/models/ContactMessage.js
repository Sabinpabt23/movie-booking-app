const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContactMessage = sequelize.define('ContactMessage', {
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'unread',
        validate: {
            isIn: [['unread', 'read']]
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'contact_messages',
    timestamps: false
});

module.exports = ContactMessage;