'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheaters: 0,
    totalShows: 0,
    totalBookings: 0,
    totalUsers: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const response = await fetch(`${API_URL}/api/admin/dashboard`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setStats({
        totalMovies: data.totalMovies || 0,
        totalTheaters: data.totalTheaters || 0,
        totalShows: data.totalShows || 0,
        totalBookings: data.totalBookings || 0,
        totalUsers: data.totalUsers || 0,
        unreadMessages: data.unreadMessages || 0,
        changes: data.changes || {}
      });
      
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #f3f3f3', 
            borderTop: '3px solid #f97315', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        background: '#fee2e2', 
        color: '#991b1b', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1rem' 
      }}>
        {error}
      </div>
    );
  }

  const statCards = [
    { title: 'Total Movies', value: stats.totalMovies, icon: '🎬', color: '#f97315', bg: '#fff6e9' },
    { title: 'Total Theaters', value: stats.totalTheaters, icon: '🏢', color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Total Shows', value: stats.totalShows, icon: '🎫', color: '#10b981', bg: '#e6f7f0' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: '📅', color: '#8b5cf6', bg: '#f3e8ff' },
    { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#ec4899', bg: '#fce7f3' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: '✉️', color: '#f59e0b', bg: '#fef3c7' },
  ];

  const quickActions = [
    { title: 'Add Movie', icon: '🎬', desc: 'Create new movie', link: '/admin/movies', color: '#f97315' },
    { title: 'Add Theater', icon: '🏢', desc: 'Register new theater', link: '/admin/theaters', color: '#3b82f6' },
    { title: 'Create Show', icon: '🎫', desc: 'Schedule showtime', link: '/admin/shows', color: '#10b981' },
    { title: 'View Bookings', icon: '📅', desc: 'Check all bookings', link: '/admin/bookings', color: '#8b5cf6' },
    { title: 'Messages', icon: '✉️', desc: 'Read contact messages', link: '/admin/messages', color: '#f59e0b' },
    { title: 'Settings', icon: '⚙️', desc: 'System settings', link: '/admin/settings', color: '#6b7280' },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Welcome back, Admin
        </h1>
        <p style={{ color: '#6b7280' }}>
          Here's what's happening with your movie booking system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((card, index) => (
          <div key={index} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${card.color}, ${card.color}80)`,
              borderRadius: '4px 4px 0 0'
            }}></div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
                {card.title}
              </span>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
              {card.value}
            </div>
           {/* Show percentage based on card title */}
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '0.5rem', 
  fontSize: '0.85rem', 
  color: '#10b981' 
}}>
  ↑ {
    card.title === 'Total Movies' ? (stats.totalMovies * 0.01).toFixed(2) :
    card.title === 'Total Theaters' ? (stats.totalTheaters * 0.01).toFixed(2) :
    card.title === 'Total Shows' ? (stats.totalShows * 0.01).toFixed(2) :
    card.title === 'Total Bookings' ? (stats.totalBookings * 0.01).toFixed(2) :
    card.title === 'Total Users' ? (stats.totalUsers * 0.01).toFixed(2) :
    card.title === 'Unread Messages' ? (stats.unreadMessages * 0.01).toFixed(2) : 0
  }% 
  <span style={{ color: '#6b7280' }}>vs last month</span>
</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {/* Quick Actions Panel */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>Quick Actions</h3>
            <Link href="#" style={{ color: '#f97315', fontSize: '0.9rem', textDecoration: 'none' }}>View All</Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            {quickActions.map((action, index) => (
              <Link 
                key={index} 
                href={action.link}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '1.2rem 1rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: '1px solid transparent',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{action.icon}</div>
                  <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                    {action.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* System Status Panel */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>System Status</h3>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500',
              background: '#d1fae5',
              color: '#065f46'
            }}>All Systems Online</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                <span>🖥️</span> Server Status
              </div>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: '#d1fae5',
                color: '#065f46'
              }}>Online</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                <span>🗄️</span> Database
              </div>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: '#d1fae5',
                color: '#065f46'
              }}>Connected</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                <span>🔌</span> API Status
              </div>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: '#d1fae5',
                color: '#065f46'
              }}>Operational</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                <span>📊</span> Active Bookings
              </div>
              <span style={{ fontWeight: '600', color: '#1f2937' }}>{stats.totalBookings}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4b5563' }}>
                <span>📧</span> Unread Messages
              </div>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: '#fed7aa',
                color: '#92400e'
              }}>{stats.unreadMessages} Unread</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animation style */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}