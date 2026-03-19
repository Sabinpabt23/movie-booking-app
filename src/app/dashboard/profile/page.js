'use client';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>My Profile</h1>
      <div style={{ 
        background: 'white', 
        borderRadius: '16px', 
        padding: '2rem',
        marginTop: '1.5rem',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>Name</label>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1f2937' }}>{user.user_name}</p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>Email</label>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1f2937' }}>{user.user_email}</p>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>Phone</label>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1f2937' }}>{user.user_phone || 'Not provided'}</p>
        </div>
        <div>
          <label style={{ fontSize: '0.9rem', color: '#6b7280' }}>Date of Birth</label>
          <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#1f2937' }}>
            {user.user_dob ? new Date(user.user_dob).toLocaleDateString() : 'Not provided'}
          </p>
        </div>
      </div>
    </div>
  );
}