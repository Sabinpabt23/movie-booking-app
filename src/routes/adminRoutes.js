const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const {
    Movie, Theater, Hall, Show, 
    Booking, User, Payment, Ticket, 
    ShowSeat, ContactMessage
} = require('../models');
const { Op } = require('sequelize');

router.get('/dashboard', async (req, res) => {
    try {
        // Get current date ranges
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Helper function for simple linear percentage (each item = 0.01%)
        const getLinearChange = (current) => {
            // Each item = 0.01%
            return (current * 0.01).toFixed(2);
        };
        
        // Total counts
        const totalMovies = await Movie.count();
        const totalTheaters = await Theater.count();
        const totalShows = await Show.count();
        const totalBookings = await Booking.count();
        const totalUsers = await User.count();
        const unreadMessages = await ContactMessage.count({ where: { status: 'unread' } });

        // Current month counts
        const currentMonthBookings = await Booking.count({
            where: { booking_date: { [Op.gte]: startOfCurrentMonth } }
        });
        
        const currentMonthUsers = await User.count({
            where: { user_reg_date: { [Op.gte]: startOfCurrentMonth } }
        });
        
        const currentMonthMessages = await ContactMessage.count({
            where: { 
                created_at: { [Op.gte]: startOfCurrentMonth }
            }
        });

        // Previous month counts
        const previousMonthBookings = await Booking.count({
            where: {
                booking_date: {
                    [Op.gte]: startOfPreviousMonth,
                    [Op.lt]: startOfCurrentMonth
                }
            }
        });
        
        const previousMonthUsers = await User.count({
            where: {
                user_reg_date: {
                    [Op.gte]: startOfPreviousMonth,
                    [Op.lt]: startOfCurrentMonth
                }
            }
        });
        
        const previousMonthMessages = await ContactMessage.count({
            where: {
                created_at: {
                    [Op.gte]: startOfPreviousMonth,
                    [Op.lt]: startOfCurrentMonth
                }
            }
        });

        // Calculate linear percentages based on current counts
        const movieChange = getLinearChange(totalMovies);
        const theaterChange = getLinearChange(totalTheaters);
        const showChange = getLinearChange(totalShows);
        const bookingChange = getLinearChange(totalBookings);
        const userChange = getLinearChange(totalUsers);
        const messageChange = getLinearChange(unreadMessages);

        res.json({
            totalMovies,
            totalTheaters,
            totalShows,
            totalBookings,
            totalUsers,
            unreadMessages,
            changes: {
                movies: { value: movieChange, direction: 'up' },
                theaters: { value: theaterChange, direction: 'up' },
                shows: { value: showChange, direction: 'up' },
                bookings: { value: bookingChange, direction: 'up' },
                users: { value: userChange, direction: 'up' },
                messages: { value: messageChange, direction: 'up' }
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
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

router.post('/movies', upload.single('movie_poster'), async (req, res) => {
    try {
        const movieData = { ...req.body };
        
        // If file was uploaded, add the path
        if (req.file) {
            movieData.movie_poster = `/uploads/movies/${req.file.filename}`;
        }

        const movie = await Movie.create(movieData);
        res.status(201).json(movie);
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update movie PUT route
router.put('/movies/:id', upload.single('movie_poster'), async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const movieData = { ...req.body };
        
        // If new file was uploaded, update the path
        if (req.file) {
            movieData.movie_poster = `/uploads/movies/${req.file.filename}`;
            console.log('New file uploaded:', movieData.movie_poster);
        } else if (req.body.movie_poster) {
            // Keep existing poster if no new file
            movieData.movie_poster = req.body.movie_poster;
            console.log('Keeping existing poster:', movieData.movie_poster);
        }

        console.log('Updating movie with data:', movieData);
        await movie.update(movieData);
        
        const updatedMovie = await Movie.findByPk(req.params.id);
        res.json(updatedMovie);
    } catch (error) {
        console.error('Error updating movie:', error);
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