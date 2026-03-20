'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import './movie.css';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      // Fetch movies
      const moviesRes = await fetch('http://localhost:5000/api/admin/movies');
      const moviesData = await moviesRes.json();

      // Fetch shows to get real prices
      const showsRes = await fetch('http://localhost:5000/api/admin/shows');
      const showsData = await showsRes.json();

      // Create a map of movie prices (lowest price for each movie)
      const moviePrices = {};
      showsData.forEach(show => {
        const movieId = show.movie_id;
        const price = show.ticket_price;
        if (!moviePrices[movieId] || price < moviePrices[movieId]) {
          moviePrices[movieId] = price;
        }
      });

      // Attach prices to movies
      const moviesWithPrices = moviesData.map(movie => ({
        ...movie,
        ticket_price: moviePrices[movie.movie_id] || 'N/A'
      }));

      setMovies(moviesWithPrices);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="movies-container">
      <div className="movies-header">
        <h1 className="movies-title">All Movies</h1>
        <div className="movies-count">{movies.length} movies available</div>
      </div>

      {movies.length === 0 ? (
        <div className="no-movies">
          <p>No movies available at the moment.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Check back soon for new releases!</p>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.movie_id} className="movie-card">
              <div className="movie-card-poster">
                {movie.movie_poster ? (
                 <img 
    src={movie.movie_poster}
    alt={movie.movie_title}
/>
                ) : (
                  <div className="movie-card-poster-placeholder">🎬</div>
                )}
                <div className="movie-card-rating">
                  {movie.movie_rating || 'New'}
                </div>
              </div>
              <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.movie_title}</h3>
                <div className="movie-card-tags">
                  <span className="movie-card-tag">{movie.movie_genre}</span>
                  <span className="movie-card-tag">{movie.movie_duration} min</span>
                  <span className="movie-card-tag">{movie.movie_language}</span>
                </div>
                <p className="movie-card-description">
                  {movie.movie_description?.substring(0, 100)}...
                </p>
                <div className="movie-card-footer">
                  <span className="movie-card-price">
                    From Rs {movie.ticket_price}
                  </span>
                  <Link 
                    href={`/dashboard/movies/${movie.movie_id}`}
                    className="movie-card-btn"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}