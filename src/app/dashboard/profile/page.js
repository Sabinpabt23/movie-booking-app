'use client';
import { useEffect, useState } from 'react';
import './profile.css';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

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
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
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

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const formData = new FormData();
      formData.append('profile_picture', selectedFile);

      const response = await fetch(`${API_URL}/api/user/upload-profile-pic`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, profile_picture: data.profile_picture });
        localStorage.setItem('user', JSON.stringify({ ...user, profile_picture: data.profile_picture }));

        window.dispatchEvent(new Event('profile-updated'));

        setSelectedFile(null);
        setPreviewUrl('');
        alert('Profile picture updated successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Server error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

const handleRemovePicture = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    
    setUploading(true);
    try {
        const token = localStorage.getItem('token');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const response = await fetch(`${API_URL}/api/user/remove-profile-pic`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            setUser({ ...user, profile_picture: null });
            localStorage.setItem('user', JSON.stringify({ ...user, profile_picture: null }));
            
            window.dispatchEvent(new Event('profile-updated'));
            
            alert('Profile picture removed successfully!');
        } else {
            alert(data.message || 'Failed to remove picture');
        }
    } catch (error) {
        console.error('Remove error:', error);
        alert('Server error. Please try again.');
    } finally {
        setUploading(false);
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
        {/* Profile Picture Section */}
        <div className="profile-field" style={{ textAlign: 'center' }}>
          <div className="profile-avatar-large">
            {user.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt="Profile"
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                background: '#f97315',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '0 auto'
              }}>
                {user.user_name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ marginTop: '1rem' }}>
    <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="profile-upload"
    />
    <label 
        htmlFor="profile-upload"
        style={{
            background: '#f97315',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'inline-block'
        }}
    >
        Choose Photo
    </label>
    {previewUrl && (
        <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                marginLeft: '0.5rem'
            }}
        >
            {uploading ? 'Uploading...' : 'Upload'}
        </button>
    )}
    {user.profile_picture && (
        <button
            onClick={handleRemovePicture}
            disabled={uploading}
            style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                marginLeft: '0.5rem'
            }}
        >
            Remove Photo
        </button>
    )}
</div>
          {previewUrl && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>Preview:</p>
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto' }}
              />
            </div>
          )}
        </div>

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