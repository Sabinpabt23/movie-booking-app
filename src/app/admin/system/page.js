'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SystemController() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/admin/login');
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else if (response.status === 401 || response.status === 403) {
                router.push('/admin/login');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

// Add this function to your SystemControllerContent component
const archiveOldData = async () => {
    if (!confirm('This will archive all bookings older than 30 days. This action cannot be undone. Continue?')) return;
    
    setActionLoading(true);
    try {
        const token = localStorage.getItem('adminToken');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/admin/archive/old-data`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        alert(data.message);
        
        // fetchUsers already exists in your component
        fetchUsers();
    } catch (error) {
        console.error('Archive error:', error);
        alert('Failed to archive data');
    } finally {
        setActionLoading(false);
    }
};

    const toggleUserLock = async (userId, currentStatus) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'unlock' : 'lock'} this user?`)) return;
        
        setActionLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await fetch(`${API_URL}/api/admin/users/${userId}/lock`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_locked: !currentStatus })
            });

            if (response.ok) {
                setMessage(`User ${!currentStatus ? 'locked' : 'unlocked'} successfully`);
                fetchUsers(); // Refresh list
                setTimeout(() => setMessage(''), 3000);
            } else {
                alert('Failed to update user status');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Server error');
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937', marginBottom: '2rem' }}>
                🛡️ System Controller
            </h1>

            {message && (
                <div style={{
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                }}>
                    {message}
                </div>
            )}

            {/* User Management Section */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #f0f0f0'
            }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
                    👥 User Management
                </h2>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Phone</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Joined</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                             </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.user_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{user.user_id}</td>
                                    <td style={{ padding: '0.75rem', fontWeight: '500' }}>{user.user_name}</td>
                                    <td style={{ padding: '0.75rem' }}>{user.user_email}</td>
                                    <td style={{ padding: '0.75rem' }}>{user.user_phone || '-'}</td>
                                    <td style={{ padding: '0.75rem' }}>{formatDate(user.user_reg_date)}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            background: user.is_locked ? '#fee2e2' : '#d1fae5',
                                            color: user.is_locked ? '#991b1b' : '#065f46',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: '500'
                                        }}>
                                            {user.is_locked ? 'Locked' : 'Active'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button
                                            onClick={() => toggleUserLock(user.user_id, user.is_locked)}
                                            disabled={actionLoading}
                                            style={{
                                                background: user.is_locked ? '#10b981' : '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {user.is_locked ? 'Unlock' : 'Lock'}
                                        </button>
                                    </td>
                                 </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

{/* Data Maintenance Section */}
<div style={{
    background: '#f9fafb',
    borderRadius: '12px',
    padding: '1rem',
    marginTop: '1.5rem'
}}>
    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>🗄️ Data Maintenance</h3>
    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
        Archive bookings older than 30 days to keep the database clean.
    </p>
    <button
        onClick={archiveOldData}
        disabled={actionLoading}
        style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
        }}
    >
        🗄️ {actionLoading ? 'Archiving...' : 'Archive Old Data (30+ days)'}
    </button>
</div>

            {/* Add spinner style */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #f97315;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
}