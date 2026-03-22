'use client';
import { useEffect, useState } from 'react';
import './profile.css';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">My Profile</h1>
      
      <div className="profile-card">
        <div className="profile-field">
          <span className="profile-label">Full Name</span>
          <div className="profile-value">
            <span className="profile-icon">👤</span>
            {user.user_name || 'Not provided'}
          </div>
        </div>

        <div className="profile-field">
          <span className="profile-label">Email Address</span>
          <div className="profile-value">
            <span className="profile-icon">📧</span>
            {user.user_email || 'Not provided'}
          </div>
        </div>

        <div className="profile-field">
          <span className="profile-label">Phone Number</span>
          <div className={`profile-value ${!user.user_phone ? 'na' : ''}`}>
            <span className="profile-icon">📞</span>
            {user.user_phone || 'Not provided'}
          </div>
        </div>

        <div className="profile-field">
          <span className="profile-label">Date of Birth</span>
          <div className={`profile-value ${!user.user_dob ? 'na' : ''}`}>
            <span className="profile-icon">🎂</span>
            {user.user_dob ? formatDate(user.user_dob) : 'Not provided'}
          </div>
        </div>

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