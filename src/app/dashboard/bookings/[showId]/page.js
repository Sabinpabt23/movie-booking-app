'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../booking.css';

export default function BookingPage() {
  const { showId } = useParams();
  const router = useRouter();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchShowData();
  }, [showId]);

  const fetchShowData = async () => {
    try {
      // Fetch show details
      const showsRes = await fetch('http://localhost:5000/api/admin/shows');
      const showsData = await showsRes.json();
      const showData = showsData.find(s => s.show_id === parseInt(showId));
      
      if (showData) {
        setShow(showData);
        
        // Fetch seats for this hall
        const seatsRes = await fetch(`http://localhost:5000/api/admin/halls/${showData.hall_id}/seats`);
        if (seatsRes.ok) {
          const seatsData = await seatsRes.json();
          
          // Fetch booked seats for this show
          const bookedSeatsRes = await fetch(`http://localhost:5000/api/shows/${showId}/booked-seats`);
          const bookedSeats = bookedSeatsRes.ok ? await bookedSeatsRes.json() : [];
          
          // Mark seats as booked
          const seatsWithStatus = seatsData.map(seat => ({
            ...seat,
            status: bookedSeats.includes(seat.seat_id) ? 'booked' : 'available'
          }));
          
          setSeats(seatsWithStatus);
        }
      }
    } catch (error) {
      console.error('Error fetching show data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.seat_id === seat.seat_id);
      if (isSelected) {
        return prev.filter(s => s.seat_id !== seat.seat_id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleConfirmBooking = async () => {
  if (selectedSeats.length === 0) {
    alert('Please select at least one seat');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        show_id: parseInt(showId),
        seat_ids: selectedSeats.map(s => s.seat_id)
      })
    });

    if (response.ok) {
      // Redirect to My Bookings page instead of confirmation page
      router.push('/dashboard/bookings');
    } else {
      const error = await response.json();
      alert(error.message || 'Booking failed. Please try again.');
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    alert('Server error. Please try again.');
  }
};

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalPrice = selectedSeats.length * (show?.ticket_price || 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="booking-container">
        <Link href="/dashboard/movies" className="back-link">← Back to Movies</Link>
        <div className="empty-state">Show not found</div>
      </div>
    );
  }

  // Group seats by row (assuming seat_number format like A1, A2, B1, etc.)
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seat_number.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const rows = Object.keys(groupedSeats).sort();

  return (
    <div className="booking-container">
      <Link href={`/dashboard/movies/${show.Movie?.movie_id}`} className="back-link">
        ← Back to Movie
      </Link>

      <div className="booking-header">
        <h1 className="booking-title">Select Your Seats</h1>
      </div>

      <div className="booking-grid">
        {/* Left Column - Movie Info */}
        <div className="movie-info-card">
          <h3>Booking Details</h3>
          <div className="info-row">
            <div className="info-label">Movie</div>
            <div className="info-value">{show.Movie?.movie_title}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Theater</div>
            <div className="info-value">{show.Hall?.Theater?.theater_name}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Hall</div>
            <div className="info-value">{show.Hall?.hall_number}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Date</div>
            <div className="info-value">{formatDate(show.show_date)}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Time</div>
            <div className="info-value">{formatTime(show.show_time)}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Price per seat</div>
            <div className="info-value">Rs {show.ticket_price}</div>
          </div>
        </div>

        {/* Right Column - Seat Selection */}
        <div className="seat-map">
          <div className="screen">SCREEN</div>
          
          <div className="seat-grid">
            {rows.map(row => (
              <div key={row} className="seat-row">
                {groupedSeats[row].map(seat => {
                  let statusClass = 'seat-available';
                  if (selectedSeats.some(s => s.seat_id === seat.seat_id)) {
                    statusClass = 'seat-selected';
                  } else if (seat.status === 'booked') {
                    statusClass = 'seat-booked';
                  }
                  
                  return (
                    <div
                      key={seat.seat_id}
                      className={`seat ${statusClass}`}
                      onClick={() => handleSeatClick(seat)}
                    >
                      {seat.seat_number}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-box legend-available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-box legend-booked"></div>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-box legend-selected"></div>
              <span>Selected</span>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="selected-seats">
              <h4>Selected Seats</h4>
              <div className="selected-seats-list">
                {selectedSeats.map(seat => (
                  <span key={seat.seat_id} className="selected-seat-badge">
                    {seat.seat_number}
                  </span>
                ))}
              </div>
              <div className="total-price">
                Total: Rs <span>{totalPrice}</span>
              </div>
            </div>
          )}

          <button
            className="confirm-btn"
            onClick={handleConfirmBooking}
            disabled={selectedSeats.length === 0}
          >
            Confirm Booking ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
          </button>
        </div>
      </div>
    </div>
  );
}