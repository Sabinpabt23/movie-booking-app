'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path) => {
    return pathname === path;
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="text-center">
          <div className="spinner"></div>
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-container">
          {/* Top Row - Logo and User */}
          <div className="nav-top-row">
            <Link href="/dashboard" className="logo">
              🎬 Sabin Booking
            </Link>
            <div className="user-section">
              <Link href="/dashboard/profile" className="profile-link">
                <div className="profile-avatar">
                  {user.user_name?.charAt(0).toUpperCase()}
                </div>
                <span>Profile</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>

          {/* Bottom Row - Navigation Links */}
          <div className="nav-bottom-row">
            <Link 
              href="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard/movies" 
              className={`nav-link ${isActive('/dashboard/movies') ? 'active' : ''}`}
            >
              View Movies
            </Link>
            <Link 
              href="/dashboard/bookings" 
              className={`nav-link ${isActive('/dashboard/bookings') ? 'active' : ''}`}
            >
              My Bookings
            </Link>
            <Link 
              href="/dashboard/blogs" 
              className={`nav-link ${isActive('/dashboard/blogs') ? 'active' : ''}`}
            >
              Blogs
            </Link>
            <Link 
              href="/dashboard/contact" 
              className={`nav-link ${isActive('/dashboard/contact') ? 'active' : ''}`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}