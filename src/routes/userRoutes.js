/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 *   security:
 *     - bearerAuth: []
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_name:
 *                   type: string
 *                 user_email:
 *                   type: string
 *                 user_phone:
 *                   type: string
 *                 user_dob:
 *                   type: string
 *                   format: date
 *                 user_reg_date:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/bookings:
 *   get:
 *     summary: Get user's all bookings
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   movie:
 *                     type: string
 *                   theater:
 *                     type: string
 *                   seats:
 *                     type: string
 *                   date:
 *                     type: string
 *                   time:
 *                     type: string
 *                   total:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/bookings/recent:
 *   get:
 *     summary: Get user's recent 5 bookings
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   movie:
 *                     type: string
 *                   theater:
 *                     type: string
 *                   seats:
 *                     type: string
 *                   date:
 *                     type: string
 *                   total:
 *                     type: number
 */




const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, Booking, Show, Movie, Theater, Hall, Seat, ShowSeat, Payment, Ticket } = require('../models');
const { Op } = require('sequelize');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'user_name', 'user_email', 'user_phone', 'user_dob', 'user_reg_date']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.user_id },
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
                },
                { model: Ticket }
            ],
            order: [['booking_date', 'DESC']]
        });

      const formattedBookings = bookings.map(booking => ({
    id: booking.booking_id,
    movie: booking.Show?.Movie?.movie_title,
    theater: booking.Show?.Hall?.Theater?.theater_name,
    hall: booking.Show?.Hall?.hall_number,
    seats: booking.ShowSeats?.map(ss => ss.Seat?.seat_number).join(', '),
    date: booking.Show?.show_date,
    time: booking.Show?.show_time,
    total: booking.total_price || 0,  // Use stored total_price instead of calculating
    status: 'confirmed'
}));

        res.json(formattedBookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's recent bookings (limit 5)
router.get('/bookings/recent', auth, async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.user_id },
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
            ],
            order: [['booking_date', 'DESC']],
            limit: 5
        });

        const formattedBookings = bookings.map(booking => ({
            id: booking.booking_id,
            movie: booking.Show?.Movie?.movie_title,
            theater: booking.Show?.Hall?.Theater?.theater_name,
            seats: booking.ShowSeats?.map(ss => ss.Seat?.seat_number).join(', '),
            date: booking.Show?.show_date,
            total: booking.total_price || 0  // Change this line
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error('Error fetching recent bookings:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;