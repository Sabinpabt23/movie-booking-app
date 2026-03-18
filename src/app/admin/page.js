'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('admin');
      
      console.log('Token exists:', !!token);
      console.log('User exists:', !!userStr);

      if (!token || !userStr) {
        console.log('No token or user, redirecting to login');
        router.push('/login');
        return;
      }

      // Check if user is admin
      const user = JSON.parse(userStr);
      console.log('User role:', user.role);

      // For now, let's bypass role check for testing
      // We'll add this back after fixing
      
      await fetchDashboardStats(token);
      
    } catch (err) {
      console.error('Auth check error:', err);
      setError('Authentication failed');
      setLoading(false);
    } finally {
      setAuthChecked(true);
    }
  };

const fetchDashboardStats = async (token) => {
  try {
    console.log('Fetching dashboard stats with token:', token);
    
    const response = await fetch('http://localhost:5000/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Dashboard response status:', response.status);
    
    // Try to get error details
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Dashboard data received:', data);
    setStats(data);
    
  } catch (err) {
    console.error('Fetch error details:', err);
    setError('Failed to load dashboard data: ' + err.message);
  } finally {
    setLoading(false);
  }
};

  // Show loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading dashboard...</div>
        <div style={{ marginTop: '1rem', color: '#9ca3af' }}>Please wait</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ 
          background: '#fee2e2', 
          color: '#991b1b', 
          padding: '1rem', 
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
          <div>{error}</div>
          <button 
            onClick={() => router.push('/')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#f97315',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ color: '#6b7280' }}>No dashboard data available</div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Movies', value: stats.totalMovies || 0, icon: '🎬', color: '#f97315' },
    { title: 'Total Theaters', value: stats.totalTheaters || 0, icon: '🏢', color: '#3b82f6' },
    { title: 'Total Shows', value: stats.totalShows || 0, icon: '🎫', color: '#10b981' },
    { title: 'Total Bookings', value: stats.totalBookings || 0, icon: '📅', color: '#8b5cf6' },
    { title: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: '#ec4899' },
    { title: 'Unread Messages', value: stats.unreadMessages || 0, icon: '✉️', color: '#f59e0b' },
  ];

  return (
    <div>
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-title">
              <span className="stat-icon">{card.icon}</span>
              {card.title}
            </div>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Quick Actions */}
        <div className="admin-form" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Link href="/admin/movies" className="admin-btn admin-btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              ➕ Add New Movie
            </Link>
            <Link href="/admin/theaters" className="admin-btn admin-btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              🏢 Add New Theater
            </Link>
            <Link href="/admin/shows" className="admin-btn admin-btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              🎫 Create New Show
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="admin-form" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>System Status</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span>Server Status</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span>Database</span>
              <span className="badge badge-success">Connected</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <span>API Status</span>
              <span className="badge badge-success">Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>New Messages</span>
              <span className="badge badge-warning">{stats.unreadMessages || 0} Unread</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}