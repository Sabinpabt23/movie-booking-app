'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import '../movie.css';

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieData();
  }, [id]);

const fetchMovieData = async () => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Fetch movie details
    const movieRes = await fetch(`${API_URL}/api/admin/movies/${id}`);
    const movieData = await movieRes.json();
    setMovie(movieData);

    // Fetch all shows for this movie
    const showsRes = await fetch(`${API_URL}/api/admin/shows`);
    const showsData = await showsRes.json();

    // Filter shows for this movie
    const movieShows = showsData.filter(show => show.movie_id === parseInt(id));

    // Group shows by theater
    const theatersMap = new Map();
    movieShows.forEach(show => {
      const theater = show.Hall?.Theater;
      const hall = show.Hall;
      
      if (theater && hall) {
        if (!theatersMap.has(theater.theater_id)) {
          theatersMap.set(theater.theater_id, {
            id: theater.theater_id,
            name: theater.theater_name,
            location: theater.theater_location,
            halls: new Map()
          });
        }
        
        const theaterData = theatersMap.get(theater.theater_id);
        
        if (!theaterData.halls.has(hall.hall_id)) {
          theaterData.halls.set(hall.hall_id, {
            id: hall.hall_id,
            number: hall.hall_number,
            capacity: hall.hall_capacity,
            shows: []
          });
        }
        
        theaterData.halls.get(hall.hall_id).shows.push({
          id: show.show_id,
          time: show.show_time,
          date: show.show_date,
          price: show.ticket_price
        });
      }
    });

    // Convert to array format for rendering
    const theatersArray = Array.from(theatersMap.values()).map(theater => ({
      ...theater,
      halls: Array.from(theater.halls.values())
    }));

    setTheaters(theatersArray);
  } catch (error) {
    console.error('Error fetching movie data:', error);
  } finally {
    setLoading(false);
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-detail-container">
        <Link href="/dashboard/movies" className="back-link">
          ← Back to Movies
        </Link>
        <div className="empty-state">Movie not found</div>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      <Link href="/dashboard/movies" className="back-link">
        ← Back to Movies
      </Link>

      {/* Movie Details Card */}
      <div className="movie-detail-card">
        <div className="movie-detail-content">
          <div className="movie-poster">
            {movie.movie_poster ? (
              <img 
    src={movie.movie_poster}
    alt={movie.movie_title}
/>
            ) : (
              <div className="movie-poster-placeholder">🎬</div>
            )}
          </div>
          <div className="movie-info">
            <h1 className="movie-title">{movie.movie_title}</h1>
            <div className="movie-tags">
              <span className="movie-tag">{movie.movie_genre}</span>
              <span className="movie-tag">{movie.movie_duration} min</span>
              <span className="movie-tag">{movie.movie_language}</span>
            </div>
            <div className="movie-rating">
              ⭐ {movie.movie_rating || 'Not rated yet'}
            </div>
            <p className="movie-description">{movie.movie_description}</p>
            <div className="movie-meta">
              <div className="movie-meta-item">
                📅 Release: {new Date(movie.movie_release_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theaters and Book Now Buttons */}
      <h2 className="section-title">Select Theater & Showtime</h2>

      {theaters.length === 0 ? (
        <div className="empty-state">
          No showtimes available for this movie yet.
        </div>
      ) : (
        theaters.map(theater => (
          <div key={theater.id} className="theater-card">
            <div className="theater-header">
              <div>
                <div className="theater-name">{theater.name}</div>
                <div className="theater-location">📍 {theater.location}</div>
              </div>
            </div>
            
            {theater.halls.map(hall => (
              <div key={hall.id}>
                <div className="hall-info">
                  <span>🎬 {hall.number}</span>
                  <span>🪑 {hall.capacity} seats</span>
                </div>
                <div className="showtimes-grid">
                  {hall.shows.map(show => (
                    <div key={show.id} className="showtime-card">
                      <div className="showtime-time">
                        {formatTime(show.time)}
                        {show.date && (
                          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                            {formatDate(show.date)}
                          </div>
                        )}
                      </div>
                      <div className="showtime-price">Rs {show.price}</div>
                      <Link 
                        href={`/dashboard/bookings/${show.id}`}
                        className="select-seats-btn"
                      >
                        Book Now →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}