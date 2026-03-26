'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './dashboard.css';
import { setupAuthInterceptor } from '@/utils/api';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  // Call this once when app loads
if (typeof window !== 'undefined') {
    setupAuthInterceptor();
}

  const checkUserAuth = async () => {
    try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
            window.location.href = '/login';
            return;
        }

        // Parse stored user
        const parsedStoredUser = JSON.parse(storedUser);
        
        // Fetch fresh user data
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const freshUserData = await response.json();
            
            // Check if the fetched user matches the stored user
            if (freshUserData.user_id !== parsedStoredUser.user_id) {
                console.log('User mismatch, clearing storage');
                localStorage.clear();
                window.location.href = '/login';
                return;
            }
            
            setUser(freshUserData);
            // Update localStorage with fresh data
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
                  {user?.user_name?.charAt(0).toUpperCase()}
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