const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
    movie_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    movie_title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
    },
    movie_description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    movie_duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    movie_genre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    movie_rating: {
        type: DataTypes.DECIMAL(3,1),
        validate: {
            min: 0,
            max: 10
        }
    },
    movie_poster: {
        type: DataTypes.TEXT
    },
    movie_release_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    movie_language: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'movie',
    timestamps: false
});

module.exports = Movie;