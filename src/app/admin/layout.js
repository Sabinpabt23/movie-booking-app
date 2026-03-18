'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard' },
    { path: '/admin/movies', icon: '🎬', label: 'Movies' },
    { path: '/admin/theaters', icon: '🏢', label: 'Theaters' },
    { path: '/admin/shows', icon: '🎫', label: 'Shows' },
    { path: '/admin/bookings', icon: '📅', label: 'Bookings' },
    { path: '/admin/messages', icon: '✉️', label: 'Messages' },
  ];

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