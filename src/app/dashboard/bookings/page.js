'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import './booking.css';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/user/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
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

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h1 className="booking-title">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>You haven't made any bookings yet.</p>
          <Link href="/dashboard/movies" className="hero-btn" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Movie</th>
                <th>Theater</th>
                <th>Seats</th>
                <th>Date</th>
                <th>Time</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td className="movie-title">{booking.movie}</td>
                  <td>{booking.theater}</td>
                  <td>{booking.seats}</td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{formatTime(booking.time)}</td>
                  <td className="price">Rs {booking.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}