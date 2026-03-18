const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
    Movie, Theater, Hall, Show, 
    Booking, User, Payment, Ticket, 
    ShowSeat, ContactMessage
} = require('../models');
const { Op } = require('sequelize');

// All routes require admin authentication
router.use(adminAuth);

// ========== DASHBOARD STATS ==========

router.get('/dashboard', async (req, res) => {
    try {
        const totalMovies = await Movie.count();
        const totalTheaters = await Theater.count();
        const totalShows = await Show.count();
        const totalBookings = await Booking.count();
        const totalUsers = await User.count();
        const unreadMessages = await ContactMessage.count({ where: { status: 'unread' } });

        res.json({
            totalMovies,
            totalTheaters,
            totalShows,
            totalBookings,
            totalUsers,
            unreadMessages
        });
    } catch (error) {
        console.error('Dashboard error:', error); // Add this log
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ========== MOVIE MANAGEMENT ==========
router.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.findAll({ order: [['movie_id', 'DESC']] });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/movies', async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        await movie.update(req.body);
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        await movie.destroy();
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ========== THEATER MANAGEMENT ==========
router.get('/theaters', async (req, res) => {
    try {
        const theaters = await Theater.findAll({
            include: [{
                model: Hall,
                as: 'Halls'
            }],
            order: [['theater_id', 'DESC']]
        });
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/theaters', async (req, res) => {
    try {
        const { theater_name, theater_location, halls } = req.body;
        
        const theater = await Theater.create({
            theater_name,
            theater_location
        });

        if (halls && halls.length > 0) {
            for (const hall of halls) {
                await Hall.create({
                    theater_id: theater.theater_id,
                    hall_number: hall.hall_number,
                    hall_capacity: hall.capacity
                });
            }
        }

        const fullTheater = await Theater.findByPk(theater.theater_id, {
            include: [{ model: Hall, as: 'Halls' }]
        });

        res.status(201).json(fullTheater);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/theaters/:id', async (req, res) => {
    try {
        const theater = await Theater.findByPk(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        await theater.update(req.body);
        res.json(theater);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/theaters/:id', async (req, res) => {
    try {
        const theater = await Theater.findByPk(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }
        await theater.destroy();
        res.json({ message: 'Theater deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ========== HALL MANAGEMENT ==========
router.post('/halls', async (req, res) => {
    try {
        const hall = await Hall.create(req.body);
        res.status(201).json(hall);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/halls/:id', async (req, res) => {
    try {
        const hall = await Hall.findByPk(req.params.id);
        if (!hall) {
            return res.status(404).json({ message: 'Hall not found' });
        }
        await hall.destroy();
        res.json({ message: 'Hall deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ========== SHOW MANAGEMENT ==========
router.get('/shows', async (req, res) => {
    try {
        const shows = await Show.findAll({
            include: [
                { model: Movie },
                { 
                    model: Hall,
                    include: [{ model: Theater }]
                }
            ],
            order: [['show_date', 'DESC'], ['show_time', 'DESC']]
        });
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/shows', async (req, res) => {
    try {
        const { movie_id, hall_id, show_date, show_time, ticket_price } = req.body;
        
        const show = await Show.create({
            movie_id,
            hall_id,
            show_date,
            show_time,
            ticket_price
        });

        // Create show_seat entries for all seats in this hall
        const seats = await Seat.findAll({ where: { hall_id } });
        for (const seat of seats) {
            await ShowSeat.create({
                show_id: show.show_id,
                seat_id: seat.seat_id,
                status: 'available'
            });
        }

        const fullShow = await Show.findByPk(show.show_id, {
            include: [
                { model: Movie },
                { 
                    model: Hall,
                    include: [{ model: Theater }]
                }
            ]
        });

        res.status(201).json(fullShow);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/shows/:id', async (req, res) => {
    try {
        const show = await Show.findByPk(req.params.id);
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }
        await show.update(req.body);
        res.json(show);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/shows/:id', async (req, res) => {
    try {
        const show = await Show.findByPk(req.params.id);
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }
        await show.destroy();
        res.json({ message: 'Show deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ========== VIEW BOOKINGS ==========
router.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { 
                    model: User,
                    attributes: ['user_id', 'user_name', 'user_email', 'user_phone']
                },
                {
                    model: Show,
                    include: [
                        { model: Movie },
                        { 
                            model: Hall,
                            include: [{ model: Theater }]
                        }
                    ]
                },
                {
                    model: ShowSeat,
                    include: [{ model: Seat }]
                },
                { model: Payment },
                { model: Ticket }
            ],
            order: [['booking_date', 'DESC']]
        });

        // Format the response to match PDF requirements
        const formattedBookings = bookings.map(booking => ({
            booking_id: booking.booking_id,
            booking_date: booking.booking_date,
            user: booking.User,
            movie: booking.Show?.Movie,
            theater: booking.Show?.Hall?.Theater,
            hall: booking.Show?.Hall,
            show_date: booking.Show?.show_date,
            show_time: booking.Show?.show_time,
            seats: booking.ShowSeats?.map(ss => ss.Seat?.seat_number),
            total_seats: booking.ShowSeats?.length,
            payment: booking.Payment,
            ticket: booking.Ticket,
            status: booking.Payment?.payment_status || 'pending'
        }));

        res.json(formattedBookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ========== CONTACT MESSAGES ==========
router.get('/messages', async (req, res) => {
    try {
        const messages = await ContactMessage.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/messages/:id/read', async (req, res) => {
    try {
        const message = await ContactMessage.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        message.status = 'read';
        await message.save();
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/messages/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findByPk(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        await message.destroy();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;