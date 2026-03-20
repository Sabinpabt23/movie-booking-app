'use client';
import { useEffect, useState } from 'react';
import './profile.css';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Get user from localStorage
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        
        // If we have token, fetch fresh data from backend
        if (token) {
          const response = await fetch('http://localhost:5000/api/user/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const freshUserData = await response.json();
            setUser(freshUserData);
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(freshUserData));
          } else {
            // Fallback to localStorage data
            setUser(parsedUser);
          }
        } else {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
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

  if (!user) {
    return (
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        <div className="profile-card">
          <p style={{ color: '#ef4444' }}>Unable to load profile data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      
      <div className="profile-card">
        {/* Name Field */}
        <div className="profile-field">
          <span className="profile-label">Full Name</span>
          <div className="profile-value">
            <span className="profile-icon">👤</span>
            {user.user_name || 'Not provided'}
          </div>
        </div>

        {/* Email Field */}
        <div className="profile-field">
          <span className="profile-label">Email Address</span>
          <div className="profile-value">
            <span className="profile-icon">📧</span>
            {user.user_email || 'Not provided'}
          </div>
        </div>

        {/* Phone Field */}
        <div className="profile-field">
          <span className="profile-label">Phone Number</span>
          <div className={`profile-value ${!user.user_phone ? 'na' : ''}`}>
            <span className="profile-icon">📞</span>
            {user.user_phone || 'Not provided'}
          </div>
        </div>

        {/* Date of Birth Field */}
        <div className="profile-field">
          <span className="profile-label">Date of Birth</span>
          <div className={`profile-value ${!user.user_dob ? 'na' : ''}`}>
            <span className="profile-icon">🎂</span>
            {user.user_dob ? formatDate(user.user_dob) : 'Not provided'}
          </div>
        </div>

        {/* Member Since */}
        {user.user_reg_date && (
          <div className="profile-field">
            <span className="profile-label">Member Since</span>
            <div className="profile-value">
              <span className="profile-icon">📅</span>
              {formatDate(user.user_reg_date)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}