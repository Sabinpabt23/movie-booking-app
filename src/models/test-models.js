require('dotenv').config();
const sequelize = require('../config/database');
const {
    User,
    Movie,
    Theater,
    Hall,
    Show,
    Seat,
    ShowSeat,
    Booking,
    Payment,
    Ticket
} = require('./index');

async function testModels() {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        console.log('Models loaded:');
        console.log('- User:', User.name);
        console.log('- Movie:', Movie.name);
        console.log('- Theater:', Theater.name);
        console.log('- Hall:', Hall.name);
        console.log('- Show:', Show.name);
        console.log('- Seat:', Seat.name);
        console.log('- ShowSeat:', ShowSeat.name);
        console.log('- Booking:', Booking.name);
        console.log('- Payment:', Payment.name);
        console.log('- Ticket:', Ticket.name);

        console.log('All models loaded successfully');
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

testModels();