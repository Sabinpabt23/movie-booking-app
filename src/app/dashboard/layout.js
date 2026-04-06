'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './dashboard.css';
import { setupAuthInterceptor } from '@/utils/api';
import { setupTokenInterceptor } from '@/utils/tokenInterceptor';

// Call this once
if (typeof window !== 'undefined') {
    setupTokenInterceptor();
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Call this once when app loads
if (typeof window !== 'undefined') {
    setupAuthInterceptor();
}


useEffect(() => {
    checkUserAuth();
    
    // Handle profile update event
    const handleProfileUpdate = () => {
        const refreshUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const freshUserData = await response.json();
                    console.log('Refreshing user data...');
                    console.log('New profile picture:', freshUserData.profile_picture);
                    setUser(freshUserData);
                    localStorage.setItem('user', JSON.stringify(freshUserData));
                }
            } catch (error) {
                console.error('Error refreshing user:', error);
            }
        };
        
        refreshUser();
    };
    
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
        window.removeEventListener('profile-updated', handleProfileUpdate);
    };
}, []);
const checkUserAuth = async () => {
    try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('checkUserAuth called');
        console.log('Token exists:', !!token);
        
        if (!token || !storedUser) {
            window.location.href = '/login';
            return;
        }

        const parsedStoredUser = JSON.parse(storedUser);
        console.log('Stored user:', parsedStoredUser);
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const freshUserData = await response.json();
            console.log('Fresh user data from API:', freshUserData);
            console.log('Profile picture from API:', freshUserData.profile_picture);
            
            setUser(freshUserData);
            localStorage.setItem('user', JSON.stringify(freshUserData));
        } else {
            localStorage.clear();
            window.location.href = '/login';
            return;
        }
    } catch (error) {
        console.error('Auth error:', error);
        localStorage.clear();
        window.location.href = '/login';
    } finally {
        setLoading(false);
    }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const isActive = (path) => pathname === path;

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-top-row">
            <Link href="/dashboard" className="logo">
              🎬 Sabin Booking
            </Link>
            <div className="user-section">
              <Link href="/dashboard/profile" className="profile-link">
                <div className="profile-avatar">
  {user?.profile_picture ? (
    <img 
      src={user.profile_picture} 
      alt="Profile" 
      style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
    />
  ) : (
    user?.user_name?.charAt(0).toUpperCase()
  )}
</div>
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>

          <div className="nav-bottom-row">
            <Link href="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/dashboard/movies" className={`nav-link ${isActive('/dashboard/movies') ? 'active' : ''}`}>
              View Movies
            </Link>
            <Link href="/dashboard/bookings" className={`nav-link ${isActive('/dashboard/bookings') ? 'active' : ''}`}>
              My Bookings
            </Link>
            <Link href="/dashboard/blogs" className={`nav-link ${isActive('/dashboard/blogs') ? 'active' : ''}`}>
              Blogs
            </Link>
            <Link href="/dashboard/contact" className={`nav-link ${isActive('/dashboard/contact') ? 'active' : ''}`}>
              Contact Us
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}