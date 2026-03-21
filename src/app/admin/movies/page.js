'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMovies() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    movie_title: '',
    movie_description: '',
    movie_duration: '',
    movie_genre: '',
    movie_rating: '',
    movie_poster: '',
    movie_release_date: '',
    movie_language: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/movies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMITTED ===');
    console.log('Form data:', formData);
    console.log('Selected file:', selectedFile);
    
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('adminToken');
        console.log('Token exists?', token ? 'Yes' : 'No');
        
        const url = editingMovie 
            ? `${API_URL}/api/admin/movies/${editingMovie.movie_id}`
            : `${API_URL}/api/admin/movies`;
        
        console.log('URL:', url);
        
        const formDataToSend = new FormData();
        formDataToSend.append('movie_title', formData.movie_title);
        formDataToSend.append('movie_description', formData.movie_description);
        formDataToSend.append('movie_duration', formData.movie_duration);
        formDataToSend.append('movie_genre', formData.movie_genre);
        formDataToSend.append('movie_rating', formData.movie_rating);
        formDataToSend.append('movie_release_date', formData.movie_release_date);
        formDataToSend.append('movie_language', formData.movie_language);
        
        if (selectedFile) {
            console.log('Appending file:', selectedFile.name);
            formDataToSend.append('movie_poster', selectedFile);
        }
        
        console.log('Sending request...');
        const response = await fetch(url, {
            method: editingMovie ? 'PUT' : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataToSend
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Get response text
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        
        // Try to parse JSON
        let result;
        try {
            result = JSON.parse(responseText);
            console.log('Parsed JSON:', result);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            result = { message: responseText || 'Unknown error' };
        }
        
        if (response.ok) {
            console.log('Success!');
            resetForm();
            fetchMovies();
            alert('Movie saved successfully!');
        } else {
            // Show the error message from backend
            const errorMessage = result.message || 'Failed to save movie. Please try again.';
            console.log('Error message:', errorMessage);
            console.log('Save failed:', result);
            window.alert(errorMessage);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error. Please check your connection.');
    }
};
 const handleEdit = (movie) => {
  setEditingMovie(movie);
  setFormData({
    movie_title: movie.movie_title || '',
    movie_description: movie.movie_description || '',
    movie_duration: movie.movie_duration || '',
    movie_genre: movie.movie_genre || '',
    movie_rating: movie.movie_rating || '',
    movie_poster: movie.movie_poster || '',
    movie_release_date: movie.movie_release_date ? movie.movie_release_date.split('T')[0] : '',
    movie_language: movie.movie_language || ''
  });
  // Set preview URL from existing poster
setPreviewUrl(movie.movie_poster || '');
  setSelectedFile(null); // Reset file selection
  setShowForm(true);
};

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/movies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchMovies();
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMovie(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData({
      movie_title: '',
      movie_description: '',
      movie_duration: '',
      movie_genre: '',
      movie_rating: '',
      movie_poster: '',
      movie_release_date: '',
      movie_language: ''
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937' }}>Movie Management</h1>
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
          {showForm ? 'Cancel' : '+ Add New Movie'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
            {editingMovie ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input
                type="text"
                name="movie_title"
                placeholder="Movie Title"
                value={formData.movie_title}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                required
              />
              <input
                type="text"
                name="movie_genre"
                placeholder="Genre"
                value={formData.movie_genre}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                required
              />
              <input
                type="number"
                name="movie_duration"
                placeholder="Duration (minutes)"
                value={formData.movie_duration}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                required
              />
              <input
                type="number"
                name="movie_rating"
                step="0.1"
                placeholder="Rating (0-10)"
                value={formData.movie_rating}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <input
                type="text"
                name="movie_language"
                placeholder="Language"
                value={formData.movie_language}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                required
              />
              <input
                type="date"
                name="movie_release_date"
                placeholder="Release Date"
                value={formData.movie_release_date}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                required
              />
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Movie Poster
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', width: '100%' }}
                />
                {previewUrl && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>Preview:</p>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </div>
              <textarea
                name="movie_description"
                placeholder="Description"
                value={formData.movie_description}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px', gridColumn: 'span 2' }}
                rows="3"
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                {editingMovie ? 'Update Movie' : 'Save Movie'}
              </button>
              {editingMovie && (
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
                <th style={{ padding: '1rem', textAlign: 'left' }}>Poster</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Genre</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Duration</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Language</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Rating</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.movie_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '1rem' }}>{movie.movie_id}</td>
                  <td style={{ padding: '1rem' }}>
                    {movie.movie_poster ? (
                     <img 
    src={movie.movie_poster} 
    alt={movie.movie_title}
    style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }}
    onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/images/placeholder.jpg';
    }}
/>
                    ) : (
                      <div style={{ width: '50px', height: '70px', background: '#f3f4f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>
                        No img
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{movie.movie_title}</td>
                  <td style={{ padding: '1rem' }}>{movie.movie_genre}</td>
                  <td style={{ padding: '1rem' }}>{movie.movie_duration} min</td>
                  <td style={{ padding: '1rem' }}>{movie.movie_language}</td>
                  <td style={{ padding: '1rem' }}>{movie.movie_rating}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => handleEdit(movie)}
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
                      onClick={() => handleDelete(movie.movie_id)}
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