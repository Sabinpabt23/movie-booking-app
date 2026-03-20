'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardHome() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    // Fetch movies
    const moviesRes = await fetch('http://localhost:5000/api/admin/movies');
    const moviesData = await moviesRes.json();
    
    // Fetch shows to get prices
    const showsRes = await fetch('http://localhost:5000/api/admin/shows');
    const showsData = await showsRes.json();

    // Fetch theaters
    const theatersRes = await fetch('http://localhost:5000/api/admin/theaters');
    const theatersData = await theatersRes.json();

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
    setTheaters(theatersData);

    const token = localStorage.getItem('token');
    if (token) {
      const bookingsRes = await fetch('http://localhost:5000/api/user/bookings/recent', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setRecentBookings(bookingsData);
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};

  const getTotalSeats = (theater) => {
    return theater.Halls?.reduce((sum, hall) => sum + hall.hall_capacity, 0) || 0;
  };

  const getHallCount = (theater) => {
    return theater.Halls?.length || 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Welcome back, {user?.user_name?.split(' ')[0] || 'Guest'}! <span>🎬</span>
          </h1>
          <p className="hero-subtitle">
            Experience the best cinema in Nepal. Book seats at Kumari Cinemas, 
            QFX Civil Mall, Big Movies and more.
          </p>
          <div className="hero-buttons">
            <Link href="/dashboard/movies" className="hero-btn">
              Browse Movies
            </Link>
            <Link href="/dashboard/bookings" className="hero-btn hero-btn-outline">
              My Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎬</div>
            <div className="stat-number">{movies.length}</div>
            <div className="stat-label">Movies Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-number">{theaters.length}</div>
            <div className="stat-label">Partner Theaters</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎫</div>
            <div className="stat-number">{recentBookings.length}</div>
            <div className="stat-label">Your Bookings</div>
          </div>
        </div>

        {/* Now Showing Section */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Now Showing</h2>
            <Link href="/dashboard/movies" className="section-link">
              View All <span>→</span>
            </Link>
          </div>

          {movies.length === 0 ? (
            <p className="empty-state">No movies available at the moment.</p>
          ) : (
            <div className="movie-grid">
              {movies.slice(0, 3).map((movie) => (
                <div key={movie.movie_id} className="movie-card">
                  <div className="movie-poster">
                    {movie.movie_poster ? (
                    <img 
    src={movie.movie_poster}
    alt={movie.movie_title}
/>
                    ) : (
                      <div className="movie-poster-placeholder">🎬</div>
                    )}
                    <div className="movie-rating">
                      {movie.movie_rating || 'New'}
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.movie_title}</h3>
                    <div className="movie-tags">
                      <span className="movie-tag">{movie.movie_genre}</span>
                      <span className="movie-tag">{movie.movie_duration} min</span>
                      <span className="movie-tag">{movie.movie_language}</span>
                    </div>
                    <p className="movie-description">
                      {movie.movie_description?.substring(0, 100)}...
                    </p>
                    <div className="movie-footer">
                      <span className="movie-price">
                        Rs {movie.ticket_price || '400'}
                      </span>
                      <Link 
                        href={`/dashboard/movies/${movie.movie_id}`}
                        className="movie-book-btn"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Bookings Section */}
        {recentBookings.length > 0 && (
          <section>
            <div className="section-header">
              <h2 className="section-title">Your Recent Bookings</h2>
              <Link href="/dashboard/bookings" className="section-link">
                View All <span>→</span>
              </Link>
            </div>

            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Movie</th>
                    <th>Theater</th>
                    <th>Seats</th>
                    <th>Date</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="movie-title">{booking.movie}</td>
                      <td>{booking.theater}</td>
                      <td>{booking.seats}</td>
                      <td>{formatDate(booking.date)}</td>
                      <td className="price">Rs {booking.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Partner Theaters Section */}
        <section>
          <h2 className="section-title">Partner Theaters</h2>

          {theaters.length === 0 ? (
            <p className="empty-state">No theaters available at the moment.</p>
          ) : (
            <div className="theater-grid">
              {theaters.map((theater) => (
                <div key={theater.theater_id} className="theater-card">
                  <div className="theater-icon">🏢</div>
                  <div className="theater-info">
                    <h3 className="theater-name">{theater.theater_name}</h3>
                    <p className="theater-location">{theater.theater_location}</p>
                    <div className="theater-stats">
                      <span>🎬 {getHallCount(theater)} Halls</span>
                      <span>🪑 {getTotalSeats(theater)} Seats</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Additional Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <div className="info-card-icon">❓</div>
            <h3 className="info-card-title">Need Help?</h3>
            <p className="info-card-text">
              Have questions about bookings, payments, or theaters? We're here to help.
            </p>
            <Link href="/dashboard/contact" className="info-card-btn">
              Contact Us
            </Link>
          </div>
          <div className="info-card">
            <div className="info-card-icon">⭐</div>
            <h3 className="info-card-title">Rate Us</h3>
            <p className="info-card-text">
              Love our service? Share your experience and help us improve.
            </p>
            <Link href="#" className="info-card-btn">
              Give Feedback
            </Link>
          </div>
          <div className="info-card">
            <div className="info-card-icon">🎟️</div>
            <h3 className="info-card-title">Special Offers</h3>
            <p className="info-card-text">
              Check out our latest deals and discounts on movie tickets.
            </p>
            <Link href="#" className="info-card-btn">
              View Offers
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}