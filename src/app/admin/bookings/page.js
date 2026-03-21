'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Make sure data is an array
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date and time
  const formatDateTime = (date, time) => {
    if (!date) return '';
    const dateStr = new Date(date).toLocaleDateString();
    const timeStr = time ? time.substring(0, 5) : '';
    return `${dateStr}, ${timeStr}`;
  };

  // Filter and search bookings
  const filteredBookings = (Array.isArray(bookings) ? bookings : []).filter(booking => {
    // First apply status filter
    if (filter !== 'all' && booking.status?.toLowerCase() !== filter) {
      return false;
    }
    
    // Then apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.booking_id?.toString().includes(searchLower) ||
        booking.user?.user_name?.toLowerCase().includes(searchLower) ||
        booking.user?.user_email?.toLowerCase().includes(searchLower) ||
        booking.movie?.movie_title?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        Loading bookings...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937' }}>View Bookings</h1>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by ID, user, movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                paddingLeft: '2.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                width: '300px',
                fontSize: '0.95rem'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}>🔍</span>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Bookings</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          {searchTerm ? 'No bookings match your search' : 'No bookings found'}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Booking ID</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>User</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Movie</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Theater</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Seats</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Showtime</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Payment Status</th>
               </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.booking_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>#{booking.booking_id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{booking.user?.user_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{booking.user?.user_email}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{booking.movie?.movie_title}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{booking.theater?.theater_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{booking.hall?.hall_number}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {booking.seats?.map((seat, i) => (
                      <span key={i}>
                        {seat}{i < booking.seats.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {formatDateTime(booking.show_date, booking.show_time)}
                  </td>
                 <td style={{ padding: '1rem', fontWeight: '500' }}>
  Rs {booking.total_price || 0}
</td>
                <td style={{ padding: '1rem' }}>
  <span style={{
    background: '#10b981',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500'
  }}>
    Confirmed
  </span>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Stats */}
          <div style={{
            background: '#f9fafb',
            padding: '1rem',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            gap: '2rem',
            justifyContent: 'flex-end'
          }}>
            <div>
              <span style={{ color: '#6b7280' }}>Total Bookings: </span>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{bookings.length}</span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Completed: </span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>
                {bookings.filter(b => b.status === 'completed').length}
              </span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Pending: </span>
              <span style={{ fontWeight: '600', color: '#f59e0b' }}>
                {bookings.filter(b => b.status === 'pending').length}
              </span>
            </div>
            <div>
              <span style={{ color: '#6b7280' }}>Showing: </span>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>
                {filteredBookings.length} of {bookings.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}