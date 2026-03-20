const sequelize = require('../config/database');
const User = require('./User');
const Movie = require('./Movie');
const Theater = require('./Theater');
const Hall = require('./Hall');
const Show = require('./Show');
const Seat = require('./Seat');
const ShowSeat = require('./ShowSeat');
const Booking = require('./Booking');
const Ticket = require('./Ticket');
const ContactMessage = require('./ContactMessage');
const Admin = require('./Admin');

// Define relationships

// Theater - Hall (one to many)
Theater.hasMany(Hall, { foreignKey: 'theater_id' });
Hall.belongsTo(Theater, { foreignKey: 'theater_id' });

// Hall - Seat (one to many)
Hall.hasMany(Seat, { foreignKey: 'hall_id' });
Seat.belongsTo(Hall, { foreignKey: 'hall_id' });

// Hall - Show (one to many)
Hall.hasMany(Show, { foreignKey: 'hall_id' });
Show.belongsTo(Hall, { foreignKey: 'hall_id' });

// Movie - Show (one to many)
Movie.hasMany(Show, { foreignKey: 'movie_id' });
Show.belongsTo(Movie, { foreignKey: 'movie_id' });

// Show - ShowSeat (one to many)
Show.hasMany(ShowSeat, { foreignKey: 'show_id' });
ShowSeat.belongsTo(Show, { foreignKey: 'show_id' });

// Seat - ShowSeat (one to many)
Seat.hasMany(ShowSeat, { foreignKey: 'seat_id' });
ShowSeat.belongsTo(Seat, { foreignKey: 'seat_id' });

// User - Booking (one to many)
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

// Show - Booking (one to many)
Show.hasMany(Booking, { foreignKey: 'show_id' });
Booking.belongsTo(Show, { foreignKey: 'show_id' });

// Booking - ShowSeat (one to many)
Booking.hasMany(ShowSeat, { foreignKey: 'booking_id' });
ShowSeat.belongsTo(Booking, { foreignKey: 'booking_id' });

// Booking - Ticket (one to one)
Booking.hasOne(Ticket, { foreignKey: 'booking_id' });
Ticket.belongsTo(Booking, { foreignKey: 'booking_id' });

module.exports = {
    sequelize,
    User,
    Movie,
    Theater,
    Hall,
    Show,
    Seat,
    ShowSeat,
    Booking,
    ContactMessage,
    Admin,
    Ticket
    
};