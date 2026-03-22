const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Booking, Show, ShowSeat, Seat, Ticket } = require('../models');
const { Op } = require('sequelize');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { show_id, seat_ids } = req.body;
    const user_id = req.user.user_id;

    if (!show_id || !seat_ids || seat_ids.length === 0) {
      return res.status(400).json({ message: 'Show ID and seat IDs are required' });
    }

    // Get show details to get ticket price
    const show = await Show.findByPk(show_id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    // Calculate total price
    const totalPrice = seat_ids.length * show.ticket_price;

    // Check if seats are already booked
    const bookedSeats = await ShowSeat.findAll({
      where: {
        show_id: show_id,
        seat_id: { [Op.in]: seat_ids },
        status: 'booked'
      }
    });

    if (bookedSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked',
        booked_seats: bookedSeats.map(s => s.seat_id)
      });
    }

    // Create booking with total price
    const booking = await Booking.create({
      user_id,
      show_id,
      booking_date: new Date(),
      total_price: totalPrice  // <-- ADD THIS LINE
    });

    // Update show_seat status and link to booking
    for (const seat_id of seat_ids) {
      await ShowSeat.update(
        { status: 'booked', booking_id: booking.booking_id },
        { where: { show_id, seat_id } }
      );
    }

    // Create ticket
    const ticket = await Ticket.create({
      booking_id: booking.booking_id,
      ticket_issue_date: new Date()
    });

    res.status(201).json({
      message: 'Booking successful',
      booking_id: booking.booking_id,
      total_price: totalPrice,
      seats: seat_ids.length
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booking details by ID
router.get('/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId, {
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
      ]
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user
    if (booking.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const formattedBooking = {
      id: booking.booking_id,
      booking_date: booking.booking_date,
      movie: booking.Show?.Movie?.movie_title,
      theater: booking.Show?.Hall?.Theater?.theater_name,
      hall: booking.Show?.Hall?.hall_number,
      show_date: booking.Show?.show_date,
      show_time: booking.Show?.show_time,
      seats: booking.ShowSeats?.map(ss => ss.Seat?.seat_number).join(', '),
      total_price: booking.ShowSeats?.length * (booking.Show?.ticket_price || 0),
      ticket_id: booking.Ticket?.ticket_id,
      ticket_issue_date: booking.Ticket?.ticket_issue_date
    };

    res.json(formattedBooking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get booked seats for a specific show
router.get('/shows/:showId/booked-seats', async (req, res) => {
    try {
        const bookedSeats = await ShowSeat.findAll({
            where: {
                show_id: req.params.showId,
                status: 'booked'
            },
            attributes: ['seat_id']
        });
        
        const bookedSeatIds = bookedSeats.map(seat => seat.seat_id);
        res.json(bookedSeatIds);
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;