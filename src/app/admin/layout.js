'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.css';  // This imports the CSS file

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

  // Inline styles for the layout structure
  const layoutStyles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f3f4f6'
    },
    sidebar: {
      width: '260px',
      background: 'white',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.05)',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto'
    },
    sidebarHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #f0f0f0'
    },
    sidebarHeaderTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#f97315'
    },
    main: {
      flex: 1,
      marginLeft: '260px',
      padding: '2rem'
    }
  };

  return (
    <div style={layoutStyles.container}>
      {/* Sidebar */}
      <div style={layoutStyles.sidebar}>
        <div style={layoutStyles.sidebarHeader}>
          <h2 style={layoutStyles.sidebarHeaderTitle}>🎬 Admin Panel</h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Sabin Booking</p>
        </div>
        <nav style={{ padding: '1.5rem 0' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                color: pathname === item.path ? '#f97315' : '#6b7280',
                background: pathname === item.path ? '#fff6e9' : 'transparent',
                borderLeft: pathname === item.path ? '3px solid #f97315' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={layoutStyles.main}>
        <div style={{
          background: 'white',
          padding: '1rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
            {navItems.find(item => item.path === pathname)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Admin</span>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#f97315',
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>A</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}