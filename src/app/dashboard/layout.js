'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './dashboard.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check user authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('User check - token exists:', !!token);
    console.log('User check - userData exists:', !!userData);
    
    if (!token || !userData) {
      console.log('No user token, redirecting to login');
      router.replace('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  // Show loading spinner
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f3f4f6'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #f97315',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Check if user is authenticated
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    return null; // Will redirect in useEffect
  }

const handleLogout = () => {
  console.log('User logging out...');
  
  // Clear storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  console.log('After logout - token:', localStorage.getItem('token'));
  console.log('After logout - user:', localStorage.getItem('user'));
  
  // Force a full page reload to clear any cached state
  window.location.href = '/login';
};

  const isActive = (path) => {
    return pathname === path;
  };

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
                  {user?.user_name?.charAt(0).toUpperCase()}
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