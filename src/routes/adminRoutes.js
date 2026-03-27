/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 *   security:
 *     - bearerAuth: []
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMovies:
 *                   type: integer
 *                 totalTheaters:
 *                   type: integer
 *                 totalShows:
 *                   type: integer
 *                 totalBookings:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *                 unreadMessages:
 *                   type: integer
 */

/**
 * @swagger
 * /api/admin/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of movies
 *   post:
 *     summary: Create a new movie
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - movie_title
 *               - movie_description
 *               - movie_duration
 *               - movie_genre
 *               - movie_release_date
 *               - movie_language
 *             properties:
 *               movie_title:
 *                 type: string
 *               movie_description:
 *                 type: string
 *               movie_duration:
 *                 type: integer
 *               movie_genre:
 *                 type: string
 *               movie_rating:
 *                 type: number
 *               movie_poster:
 *                 type: string
 *                 format: binary
 *               movie_release_date:
 *                 type: string
 *                 format: date
 *               movie_language:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Movie title already exists
 */

/**
 * @swagger
 * /api/admin/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie details
 *       404:
 *         description: Movie not found
 *   put:
 *     summary: Update movie
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               movie_title:
 *                 type: string
 *               movie_description:
 *                 type: string
 *               movie_duration:
 *                 type: integer
 *               movie_genre:
 *                 type: string
 *               movie_rating:
 *                 type: number
 *               movie_poster:
 *                 type: string
 *                 format: binary
 *               movie_release_date:
 *                 type: string
 *                 format: date
 *               movie_language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated
 *       404:
 *         description: Movie not found
 *   delete:
 *     summary: Delete movie
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Movie deleted
 *       404:
 *         description: Movie not found
 */

/**
 * @swagger
 * /api/admin/theaters:
 *   get:
 *     summary: Get all theaters
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of theaters with halls
 *   post:
 *     summary: Create a new theater
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theater_name
 *               - theater_location
 *             properties:
 *               theater_name:
 *                 type: string
 *               theater_location:
 *                 type: string
 *               halls:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hall_number:
 *                       type: string
 *                     capacity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Theater created with halls
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/theaters/{id}:
 *   put:
 *     summary: Update theater
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theater_name:
 *                 type: string
 *               theater_location:
 *                 type: string
 *               halls:
 *                 type: array
 *     responses:
 *       200:
 *         description: Theater updated
 *       404:
 *         description: Theater not found
 *   delete:
 *     summary: Delete theater
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theater deleted
 *       404:
 *         description: Theater not found
 */

/**
 * @swagger
 * /api/admin/shows:
 *   get:
 *     summary: Get all shows
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shows
 *   post:
 *     summary: Create a new show
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie_id
 *               - hall_id
 *               - show_date
 *               - show_time
 *               - ticket_price
 *             properties:
 *               movie_id:
 *                 type: integer
 *               hall_id:
 *                 type: integer
 *               show_date:
 *                 type: string
 *                 format: date
 *               show_time:
 *                 type: string
 *               ticket_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Show created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/shows/{id}:
 *   put:
 *     summary: Update show
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Show updated
 *   delete:
 *     summary: Delete show
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Show deleted
 */

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_id:
 *                     type: integer
 *                   user:
 *                     type: object
 *                   movie:
 *                     type: object
 *                   theater:
 *                     type: object
 *                   seats:
 *                     type: array
 *                   show_date:
 *                     type: string
 *                   show_time:
 *                     type: string
 *                   total_price:
 *                     type: number
 */


const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/uploadCloudinary');
const sequelize = require('../config/database');
const {
    Movie, Theater, Hall, Show, 
    Booking, User, Payment, Ticket, 
    ShowSeat, ContactMessage, Seat
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

router.put('/movies/:id', upload.single('movie_poster'), async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const movieData = { ...req.body };
        
        // If new file was uploaded, update the path
        if (req.file) {
            movieData.movie_poster = req.file.path;
        } else if (req.body.movie_poster) {
            movieData.movie_poster = req.body.movie_poster;
        }

        await movie.update(movieData);
        
        const updatedMovie = await Movie.findByPk(req.params.id);
        res.json(updatedMovie);
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create movie with Cloudinary
router.post('/movies', upload.single('movie_poster'), async (req, res) => {
    try {
        console.log('=== STARTING MOVIE CREATION ===');
        console.log('Movie title from form:', req.body.movie_title);
        console.log('All form fields:', req.body);
        console.log('File info:', req.file ? req.file : 'No file uploaded');
        
        // Check for duplicate movie title
        if (req.body.movie_title) {
            const existingMovie = await Movie.findOne({ 
                where: { movie_title: req.body.movie_title } 
            });
            
            console.log('Existing movie check result:', existingMovie ? `Found: ${existingMovie.movie_title}` : 'Not found');
            
            if (existingMovie) {
                console.log('Duplicate detected!');
                return res.status(400).json({ 
                    message: `Movie "${req.body.movie_title}" already exists` 
                });
            }
        } else {
            console.log('ERROR: No movie title provided!');
            return res.status(400).json({ message: 'Movie title is required' });
        }
        
        const movieData = { ...req.body };
        
        if (req.file) {
            console.log('Setting poster to:', req.file.path);
            movieData.movie_poster = req.file.path;
        }

        console.log('Creating movie with data:', movieData);
        const movie = await Movie.create(movieData);
        console.log('SUCCESS: Movie created with ID:', movie.movie_id);
        res.status(201).json(movie);
        
    } catch (error) {
        console.error('=== ERROR IN MOVIE CREATION ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single movie by ID
router.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByPk(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
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
                // Create hall
                const newHall = await Hall.create({
                    theater_id: theater.theater_id,
                    hall_number: hall.hall_number,
                    hall_capacity: parseInt(hall.capacity)
                });
                
                // AUTO-GENERATE SEATS based on capacity
                await generateSeatsForHall(newHall.hall_id, newHall.hall_capacity);
            }
        }

        const fullTheater = await Theater.findByPk(theater.theater_id, {
            include: [{ model: Hall, as: 'Halls' }]
        });

        res.status(201).json(fullTheater);
    } catch (error) {
        console.error('Error creating theater:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Helper function to generate seats for a hall
const generateSeatsForHall = async (hallId, capacity) => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let seatCount = 0;
    
    for (const row of rows) {
        for (let col = 1; col <= 10; col++) {
            if (seatCount >= capacity) break;
            seats.push({
                hall_id: hallId,
                seat_number: `${row}${col}`
            });
            seatCount++;
        }
        if (seatCount >= capacity) break;
    }
    
    if (seats.length > 0) {
        await Seat.bulkCreate(seats);
        console.log(`Generated ${seats.length} seats for hall ${hallId}`);
    }
};

router.put('/theaters/:id', async (req, res) => {
    try {
        const theater = await Theater.findByPk(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: 'Theater not found' });
        }

        await theater.update({
            theater_name: req.body.theater_name,
            theater_location: req.body.theater_location
        });

        if (req.body.halls && req.body.halls.length > 0) {
            await Hall.destroy({ where: { theater_id: theater.theater_id } });
            
            for (const hall of req.body.halls) {
                if (hall.hall_number && hall.capacity) {
                    await Hall.create({
                        theater_id: theater.theater_id,
                        hall_number: hall.hall_number,
                        hall_capacity: parseInt(hall.capacity)
                    });
                }
            }
        }

        const updatedTheater = await Theater.findByPk(theater.theater_id, {
            include: [{ model: Hall, as: 'Halls' }]
        });

        res.json(updatedTheater);
    } catch (error) {
        console.error('Error updating theater:', error);
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
// Get all seats in a hall
router.get('/halls/:hallId/seats', async (req, res) => {
    try {
        const seats = await Seat.findAll({
            where: { hall_id: req.params.hallId },
            order: [['seat_number', 'ASC']]
        });
        res.json(seats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ------- SHOW MANAGEMENT -----------
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
            ticket_price: parseFloat(ticket_price)
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
        console.error('Error creating show:', error);
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
        
        const updatedShow = await Show.findByPk(req.params.id, {
            include: [
                { model: Movie },
                { 
                    model: Hall,
                    include: [{ model: Theater }]
                }
            ]
        });
        res.json(updatedShow);
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
                { model: Ticket }
            ],
            order: [['booking_date', 'DESC']]
        });

        console.log('Found bookings:', bookings.length);

        const formattedBookings = bookings.map(booking => {
            // Calculate total price from show ticket_price × number of seats
            const seatCount = booking.ShowSeats?.length || 0;
            const ticketPrice = booking.Show?.ticket_price || 0;
            const totalPrice = seatCount * ticketPrice;
            
            return {
                booking_id: booking.booking_id,
                booking_date: booking.booking_date,
                user: booking.User,
                movie: booking.Show?.Movie,
                theater: booking.Show?.Hall?.Theater,
                hall: booking.Show?.Hall,
                show_date: booking.Show?.show_date,
                show_time: booking.Show?.show_time,
                seats: booking.ShowSeats?.map(ss => ss.Seat?.seat_number),
                total_seats: seatCount,
                total_price: totalPrice,
                ticket: booking.Ticket,
                status: 'confirmed'
            };
        });

        res.json(formattedBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
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

// ========== SYSTEM STATUS ==========
router.get('/system/status', adminAuth, async (req, res) => {
    try {
        const startTime = Date.now();
        
        // 1. Database Status
        let dbStatus = 'Connected';
        let dbError = null;
        try {
            await sequelize.authenticate();
        } catch (error) {
            dbStatus = 'Disconnected';
            dbError = error.message;
        }

        // 2. Cloudinary Status
        let cloudinaryStatus = 'Connected';
        let cloudinaryError = null;
        try {
            const cloudinary = require('cloudinary').v2;
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            const result = await cloudinary.api.ping();
            if (result.status !== 'ok') {
                throw new Error('Cloudinary ping failed');
            }
        } catch (error) {
            cloudinaryStatus = 'Disconnected';
            cloudinaryError = error.message;
        }

        // 3. API Response Time (simple check - just response time)
        const apiResponseTime = Date.now() - startTime;

        // 4. Server Uptime
        const uptimeSeconds = process.uptime();
        const uptime = {
            days: Math.floor(uptimeSeconds / 86400),
            hours: Math.floor((uptimeSeconds % 86400) / 3600),
            minutes: Math.floor((uptimeSeconds % 3600) / 60),
            seconds: Math.floor(uptimeSeconds % 60)
        };

        // 5. Memory Usage
        const memoryUsage = process.memoryUsage();
        const memory = {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            rss: Math.round(memoryUsage.rss / 1024 / 1024)
        };

        res.json({
            success: true,
            server: {
                status: 'Online',
                uptime: uptime,
                memory: memory,
                nodeVersion: process.version,
                platform: process.platform
            },
            database: {
                status: dbStatus,
                error: dbError
            },
            cloudinary: {
                status: cloudinaryStatus,
                error: cloudinaryError
            },
            api: {
                status: 'Operational',
                responseTime: apiResponseTime
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('System status error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get system status',
            error: error.message 
        });
    }
});


// ========== FINANCIAL REPORT ==========
router.get('/system/financial', adminAuth, async (req, res) => {
    try {
        // Get all bookings with their show and seat details
        const bookings = await Booking.findAll({
            include: [
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
                }
            ]
        });

        let totalRevenue = 0;
        let totalTicketsSold = 0;
        let movieRevenue = {};
        let theaterRevenue = {};
        let monthlyRevenue = {};

        bookings.forEach(booking => {
            // Get the number of seats from ShowSeats
            const seatCount = booking.ShowSeats?.length || 0;
            
            // Calculate from show ticket price
            let bookingTotal = 0;
            if (seatCount > 0 && booking.Show) {
                bookingTotal = seatCount * Number(booking.Show.ticket_price);
            }
            
            // Add to totals (use Number() to ensure numeric addition)
            totalRevenue += Number(bookingTotal);
            totalTicketsSold += seatCount;

            // Movie revenue
            const movieTitle = booking.Show?.Movie?.movie_title || 'Unknown';
            if (movieTitle !== 'Unknown') {
                movieRevenue[movieTitle] = (movieRevenue[movieTitle] || 0) + Number(bookingTotal);
            }

            // Theater revenue
            const theaterName = booking.Show?.Hall?.Theater?.theater_name || 'Unknown';
            if (theaterName !== 'Unknown') {
                theaterRevenue[theaterName] = (theaterRevenue[theaterName] || 0) + Number(bookingTotal);
            }

            // Monthly revenue
            const date = new Date(booking.booking_date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + Number(bookingTotal);
        });

        // Get top 5 movies (only show if they have revenue)
        const topMovies = Object.entries(movieRevenue)
            .filter(([name, revenue]) => revenue > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, revenue]) => ({ name, revenue: Number(revenue) }));

        // Get top 3 theaters
        const topTheaters = Object.entries(theaterRevenue)
            .filter(([name, revenue]) => revenue > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, revenue]) => ({ name, revenue: Number(revenue) }));

        // Get last 6 months of revenue
        const last6Months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`;
            last6Months.push({
                month: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
                revenue: Number(monthlyRevenue[monthKey] || 0)
            });
        }

        const avgTicketPrice = totalTicketsSold > 0 ? (totalRevenue / totalTicketsSold).toFixed(2) : 0;

        console.log('Calculated totals:', { totalRevenue, totalTicketsSold, avgTicketPrice });

        res.json({
            success: true,
            totalRevenue: Number(totalRevenue),
            totalTicketsSold: totalTicketsSold,
            avgTicketPrice: Number(avgTicketPrice),
            topMovies: topMovies,
            topTheaters: topTheaters,
            monthlyRevenue: last6Months
        });
    } catch (error) {
        console.error('Financial report error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get financial report',
            error: error.message 
        });
    }
});


// ========== EXPORT FINANCIAL REPORT ==========
router.get('/export/financial', adminAuth, async (req, res) => {
    try {
        // Get all bookings with details
        const bookings = await Booking.findAll({
            include: [
                {
                    model: User,
                    attributes: ['user_name', 'user_email']
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
                }
            ],
            order: [['booking_date', 'DESC']]
        });

        // Prepare CSV data
        const csvData = bookings.map(booking => {
            const seatCount = booking.ShowSeats?.length || 0;
            const ticketPrice = booking.Show?.ticket_price || 0;
            const totalAmount = seatCount * ticketPrice;
            
            return {
                'Booking ID': booking.booking_id,
                'Booking Date': new Date(booking.booking_date).toLocaleString(),
                'User Name': booking.User?.user_name || 'N/A',
                'User Email': booking.User?.user_email || 'N/A',
                'Movie': booking.Show?.Movie?.movie_title || 'N/A',
                'Theater': booking.Show?.Hall?.Theater?.theater_name || 'N/A',
                'Hall': booking.Show?.Hall?.hall_number || 'N/A',
                'Show Date': booking.Show?.show_date ? new Date(booking.Show.show_date).toLocaleDateString() : 'N/A',
                'Show Time': booking.Show?.show_time || 'N/A',
                'Seats': booking.ShowSeats?.map(ss => ss.Seat?.seat_number).join(', ') || 'N/A',
                'Seats Count': seatCount,
                'Ticket Price': ticketPrice,
                'Total Amount': totalAmount
            };
        });

        // Convert to CSV
        const headers = Object.keys(csvData[0] || {});
        const csvRows = [
            headers.join(','),
            ...csvData.map(row => headers.map(header => {
                let value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(','))
        ];
        
        const csv = csvRows.join('\n');

        // Set headers for CSV download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=financial_report_${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
        
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ message: 'Failed to export report', error: error.message });
    }
});


// ========== USER MANAGEMENT ==========
// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['user_id', 'user_name', 'user_email', 'user_phone', 'user_reg_date', 'is_locked'],
            order: [['user_id', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Lock/Unlock user
router.put('/users/:id/lock', adminAuth, async (req, res) => {
    try {
        const { is_locked } = req.body;
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        await user.update({ is_locked: is_locked });
        
        res.json({ 
            message: is_locked ? 'User locked successfully' : 'User unlocked successfully',
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
                is_locked: user.is_locked
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ========== DATA ARCHIVE ==========
router.post('/archive/old-data', adminAuth, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Find old bookings (where show date is older than 30 days)
        const oldBookings = await Booking.findAll({
            include: [{
                model: Show,
                where: {
                    show_date: { [Op.lt]: thirtyDaysAgo }
                }
            }],
            attributes: ['booking_id']
        });
        
        const bookingIds = oldBookings.map(b => b.booking_id);
        
        if (bookingIds.length === 0) {
            return res.json({ 
                message: 'No data older than 30 days found',
                archived: 0 
            });
        }
        
        // Archive bookings
        await sequelize.query(
            `INSERT INTO booking_archive SELECT *, NOW() FROM booking WHERE booking_id IN (:ids)`,
            { replacements: { ids: bookingIds } }
        );
        
        // Archive tickets
        await sequelize.query(
            `INSERT INTO ticket_archive SELECT *, NOW() FROM ticket WHERE booking_id IN (:ids)`,
            { replacements: { ids: bookingIds } }
        );
        
        // Archive show_seat entries
        await sequelize.query(
            `INSERT INTO show_seat_archive SELECT *, NOW() FROM show_seat WHERE booking_id IN (:ids)`,
            { replacements: { ids: bookingIds } }
        );
        
        // Delete from main tables
        await ShowSeat.destroy({ where: { booking_id: bookingIds } });
        await Ticket.destroy({ where: { booking_id: bookingIds } });
        await Booking.destroy({ where: { booking_id: bookingIds } });
        
        res.json({ 
            message: `Archived ${bookingIds.length} old bookings`,
            archived: bookingIds.length 
        });
    } catch (error) {
        console.error('Archive error:', error);
        res.status(500).json({ message: 'Failed to archive data', error: error.message });
    }
});

module.exports = router;