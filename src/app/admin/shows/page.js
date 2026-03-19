'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminShows() {
  const router = useRouter();
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [formData, setFormData] = useState({
    movie_id: '',
    theater_id: '',
    hall_id: '',
    show_date: '',
    show_time: '',
    ticket_price: ''
  });

  useEffect(() => {
    fetchShows();
    fetchMovies();
    fetchTheaters();
  }, []);

  const fetchShows = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/shows', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setShows(data);
    } catch (error) {
      console.error('Error fetching shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/movies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchTheaters = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/theaters', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTheaters(data);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    }
  };

  const handleTheaterChange = (e) => {
    const theaterId = parseInt(e.target.value);
    setFormData({ 
      ...formData, 
      theater_id: theaterId,
      hall_id: '' // Reset hall when theater changes
    });

    // Find selected theater and set its halls
    const selectedTheater = theaters.find(t => t.theater_id === theaterId);
    setHalls(selectedTheater?.Halls || []);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingShow 
        ? `http://localhost:5000/api/admin/shows/${editingShow.show_id}`
        : 'http://localhost:5000/api/admin/shows';
      
      const response = await fetch(url, {
        method: editingShow ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        resetForm();
        fetchShows();
      }
    } catch (error) {
      console.error('Error saving show:', error);
    }
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    
    // Find theater from show's hall
    const theaterId = show.Hall?.theater_id;
    
    // Set halls for that theater
    const selectedTheater = theaters.find(t => t.theater_id === theaterId);
    setHalls(selectedTheater?.Halls || []);
    
    setFormData({
      movie_id: show.movie_id || '',
      theater_id: theaterId || '',
      hall_id: show.hall_id || '',
      show_date: show.show_date ? show.show_date.split('T')[0] : '',
      show_time: show.show_time || '',
      ticket_price: show.ticket_price || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this show?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/shows/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchShows();
      }
    } catch (error) {
      console.error('Error deleting show:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingShow(null);
    setFormData({
      movie_id: '',
      theater_id: '',
      hall_id: '',
      show_date: '',
      show_time: '',
      ticket_price: ''
    });
    setHalls([]);
  };

  // Format time for display
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // Gets HH:MM from HH:MM:SS
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937' }}>Show Management</h1>
        <button 
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          style={{
            background: '#f97315',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Show'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
            {editingShow ? 'Edit Show' : 'Add New Show'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Movie Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Movie</label>
                <select
                  name="movie_id"
                  value={formData.movie_id}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                >
                  <option value="">Choose a movie</option>
                  {movies.map(movie => (
                    <option key={movie.movie_id} value={movie.movie_id}>
                      {movie.movie_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theater Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Theater</label>
                <select
                  name="theater_id"
                  value={formData.theater_id}
                  onChange={handleTheaterChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                >
                  <option value="">Choose a theater</option>
                  {theaters.map(theater => (
                    <option key={theater.theater_id} value={theater.theater_id}>
                      {theater.theater_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hall Selection */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Hall</label>
                <select
                  name="hall_id"
                  value={formData.hall_id}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                  disabled={!formData.theater_id}
                >
                  <option value="">Choose a hall</option>
                  {halls.map(hall => (
                    <option key={hall.hall_id} value={hall.hall_id}>
                      {hall.hall_number} ({hall.hall_capacity} seats)
                    </option>
                  ))}
                </select>
              </div>

              {/* Show Date */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Show Date</label>
                <input
                  type="date"
                  name="show_date"
                  value={formData.show_date}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                />
              </div>

              {/* Show Time */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Show Time</label>
                <input
                  type="time"
                  name="show_time"
                  value={formData.show_time}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                />
              </div>

              {/* Ticket Price */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Ticket Price (Rs)</label>
                <input
                  type="number"
                  name="ticket_price"
                  placeholder="400"
                  value={formData.ticket_price}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                  min="1"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" style={{
                background: '#f97315',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                {editingShow ? 'Update Show' : 'Save Show'}
              </button>
              {editingShow && (
                <button type="button" onClick={resetForm} style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Movie</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Theater</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Hall</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.show_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '1rem' }}>{show.show_id}</td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{show.Movie?.movie_title}</td>
                  <td style={{ padding: '1rem' }}>{show.Hall?.Theater?.theater_name}</td>
                  <td style={{ padding: '1rem' }}>{show.Hall?.hall_number}</td>
                  <td style={{ padding: '1rem' }}>{formatDate(show.show_date)}</td>
                  <td style={{ padding: '1rem' }}>{formatTime(show.show_time)}</td>
                  <td style={{ padding: '1rem' }}>Rs {show.ticket_price}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => handleEdit(show)}
                      style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '4px', 
                        marginRight: '0.5rem', 
                        cursor: 'pointer' 
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(show.show_id)}
                      style={{ 
                        background: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '4px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}