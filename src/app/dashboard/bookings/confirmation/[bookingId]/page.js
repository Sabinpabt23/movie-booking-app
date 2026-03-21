'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../confirmation.css';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

const fetchBookingDetails = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setBooking(data);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <div className="confirmation-icon">🎉</div>
          <h1>Booking Confirmed!</h1>
          <p>Your tickets have been booked successfully</p>
        </div>

        <div className="confirmation-body">
          <div className="booking-details">
            <h2>Booking Details</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Booking ID</span>
                <span className="detail-value">#{booking.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Booking Date</span>
                <span className="detail-value">{formatDate(booking.booking_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Movie</span>
                <span className="detail-value">{booking.movie}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Theater</span>
                <span className="detail-value">{booking.theater} - {booking.hall}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date & Time</span>
                <span className="detail-value">{formatDate(booking.show_date)} at {formatTime(booking.show_time)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Total Amount</span>
                <span className="detail-value">Rs {booking.total_price}</span>
              </div>
            </div>
          </div>

          {/* Ticket Card */}
          <div className="ticket-card">
            <div className="ticket-header">
              <h3>🎬 SABIN BOOKING</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Movie Ticket</p>
            </div>
            <div className="ticket-info">
              <div className="ticket-info-item">
                <div className="ticket-info-label">Movie</div>
                <div className="ticket-info-value">{booking.movie}</div>
              </div>
              <div className="ticket-info-item">
                <div className="ticket-info-label">Theater</div>
                <div className="ticket-info-value">{booking.theater}</div>
              </div>
              <div className="ticket-info-item">
                <div className="ticket-info-label">Hall</div>
                <div className="ticket-info-value">{booking.hall}</div>
              </div>
              <div className="ticket-info-item">
                <div className="ticket-info-label">Date</div>
                <div className="ticket-info-value">{formatDate(booking.show_date)}</div>
              </div>
              <div className="ticket-info-item">
                <div className="ticket-info-label">Time</div>
                <div className="ticket-info-value">{formatTime(booking.show_time)}</div>
              </div>
              <div className="ticket-info-item">
                <div className="ticket-info-label">Booking ID</div>
                <div className="ticket-info-value">#{booking.id}</div>
              </div>
            </div>
            <div className="ticket-seats">
              <span>🎫 {booking.seats}</span>
            </div>
          </div>

          <div className="action-buttons">
            <Link href="/dashboard/bookings" className="btn-outline">
              View My Bookings
            </Link>
            <Link href="/dashboard/movies" className="btn-primary">
              Book More Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}