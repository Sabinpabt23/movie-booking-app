'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're on login page
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    // Check admin authentication
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('admin');
    
    console.log('Admin check - token exists:', !!token);
    console.log('Admin check - admin exists:', !!admin);
    console.log('Current path:', pathname);
    
    if (!token || !admin) {
      console.log('No admin token, redirecting to login');
      router.replace('/admin/login');
      return;
    }
    
    setLoading(false);
  }, [pathname, router]);

  // If on login page, just show login content
  if (pathname === '/admin/login') {
    return children;
  }

  // Show loading
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Check if user is authenticated
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (!token && pathname !== '/admin/login') {
    return null; // Will redirect in useEffect
  }

  const navItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/movies', icon: '🎬', label: 'Movies' },
    { path: '/admin/theaters', icon: '🏢', label: 'Theaters' },
    { path: '/admin/shows', icon: '🎫', label: 'Shows' },
    { path: '/admin/bookings', icon: '📅', label: 'Bookings' },
    { path: '/admin/messages', icon: '✉️', label: 'Messages' },
    { path: '/admin/system', icon: '🛡️', label: 'System Controller' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ];

const handleLogout = () => {
  console.log('Admin logging out...');
  
  // Clear storage
  localStorage.removeItem('adminToken');
  localStorage.removeItem('admin');
  
  console.log('After logout - adminToken:', localStorage.getItem('adminToken'));
  console.log('After logout - admin:', localStorage.getItem('admin'));
  
  // Force a full page reload to clear any cached state
  window.location.href = '/admin/login';
};

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>🎬 Admin Panel</h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Sabin Booking</p>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="admin-nav-item"
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span className="admin-nav-icon">🚪</span>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>{navItems.find(item => item.path === pathname)?.label || 'Dashboard'}</h1>
          <div className="admin-user">
            <span>Admin</span>
            <div className="admin-user-avatar">A</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}