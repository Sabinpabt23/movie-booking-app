'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSettings() {
    const router = useRouter();
    const [systemStatus, setSystemStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [serverDown, setServerDown] = useState(false);
    const [financial, setFinancial] = useState(null);
const [financialLoading, setFinancialLoading] = useState(false);

    useEffect(() => {
        fetchSystemStatus();
        fetchFinancialReport();
    }, []);

    const fetchSystemStatus = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/admin/login');
                return;
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            
            // Add timeout to detect server down
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(`${API_URL}/api/admin/system/status`, {
                headers: { 'Authorization': `Bearer ${token}` },
                signal: controller.signal
            }).catch(err => {
                if (err.name === 'AbortError') {
                    throw new Error('Request timeout - server may be down');
                }
                throw err;
            });
            
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                setSystemStatus(data);
                setServerDown(false);
            } else if (response.status === 401 || response.status === 403) {
                router.push('/admin/login');
            } else {
                setError('Failed to fetch system status');
            }
        } catch (err) {
            console.error('Error fetching system status:', err);
            // Check if it's a connection error
            if (err.message === 'Failed to fetch' || err.message.includes('timeout') || err.message.includes('NetworkError')) {
                setServerDown(true);
                setError('');
            } else {
                setError(err.message || 'Network error. Please try again.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

const fetchFinancialReport = async () => {
    try {
        setFinancialLoading(true);
        const token = localStorage.getItem('adminToken');
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/admin/system/financial`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            setFinancial(data);
        }
    } catch (error) {
        console.error('Error fetching financial report:', error);
    } finally {
        setFinancialLoading(false);
    }
};

    const handleRefresh = () => {
        setRefreshing(true);
        setServerDown(false);
        setError('');
        fetchSystemStatus();
    };

    const getStatusBadge = (status) => {
        if (status === 'Online' || status === 'Connected' || status === 'Operational') {
            return { color: '#10b981', bg: '#d1fae5', text: status };
        }
        if (status === 'Offline' || status === 'Disconnected') {
            return { color: '#ef4444', bg: '#fee2e2', text: status };
        }
        return { color: '#f59e0b', bg: '#fed7aa', text: status };
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    // Show Server Down Message
    if (serverDown) {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937' }}>System Settings</h1>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        style={{
                            background: '#f97315',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 {refreshing ? 'Refreshing...' : 'Retry Connection'}
                    </button>
                </div>

                <div style={{
                    background: '#fee2e2',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1px solid #fecaca'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem' }}>
                        Server Unreachable
                    </h2>
                    <p style={{ color: '#b91c1c', marginBottom: '1rem' }}>
                        Cannot connect to the backend server. Please check if the server is running.
                    </p>
                    <div style={{
                        background: '#fff',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'left',
                        marginTop: '1rem'
                    }}>
                        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Possible causes:</p>
                        <ul style={{ marginLeft: '1.5rem', color: '#6b7280' }}>
                            <li>Backend server is not running</li>
                            <li>Network connection issue</li>
                            <li>Server is starting up (wait a moment)</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    const serverStatus = getStatusBadge(systemStatus?.server?.status || 'Offline');
    const dbStatus = getStatusBadge(systemStatus?.database?.status || 'Disconnected');
    const cloudinaryStatus = getStatusBadge(systemStatus?.cloudinary?.status || 'Disconnected');
    const apiStatus = getStatusBadge(systemStatus?.api?.status || 'Offline');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937' }}>System Settings</h1>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    style={{
                        background: '#f97315',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    🔄 {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {error && (
                <div style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            {/* System Status Card */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #f0f0f0'
            }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🖥️ System Status
                    {systemStatus?.server?.status === 'Online' && 
                        <span style={{ fontSize: '0.8rem', background: '#d1fae5', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                            All Systems Operational
                        </span>
                    }
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>🖥️ Server</span>
                            <span style={{
                                background: serverStatus.bg,
                                color: serverStatus.color,
                                padding: '0.2rem 0.6rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem'
                            }}>
                                {serverStatus.text}
                            </span>
                        </div>
                        {systemStatus?.server && (
                            <>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                    Uptime: {systemStatus.server.uptime.days}d {systemStatus.server.uptime.hours}h {systemStatus.server.uptime.minutes}m
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                    Memory: {systemStatus.server.memory.heapUsed}MB / {systemStatus.server.memory.heapTotal}MB
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                    Node: {systemStatus.server.nodeVersion}
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>🗄️ Database</span>
                            <span style={{
                                background: dbStatus.bg,
                                color: dbStatus.color,
                                padding: '0.2rem 0.6rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem'
                            }}>
                                {dbStatus.text}
                            </span>
                        </div>
                        {systemStatus?.database?.error && (
                            <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem' }}>
                                Error: {systemStatus.database.error}
                            </div>
                        )}
                    </div>

                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>☁️ Cloudinary</span>
                            <span style={{
                                background: cloudinaryStatus.bg,
                                color: cloudinaryStatus.color,
                                padding: '0.2rem 0.6rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem'
                            }}>
                                {cloudinaryStatus.text}
                            </span>
                        </div>
                        {systemStatus?.cloudinary?.error && (
                            <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.25rem' }}>
                                Error: {systemStatus.cloudinary.error}
                            </div>
                        )}
                    </div>

       <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: '500' }}>🔌 API</span>
        <span style={{
            background: apiStatus.bg,
            color: apiStatus.color,
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
            fontSize: '0.8rem'
        }}>
            {apiStatus.text}
        </span>
    </div>
    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
        Response Time: {systemStatus?.api?.responseTime}ms
    </div>
    {systemStatus?.api?.error && (
        <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.5rem' }}>
            Error: {systemStatus.api.error}
        </div>
    )}
</div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0f0f0', fontSize: '0.7rem', color: '#9ca3af' }}>
                    Last checked: {systemStatus?.timestamp ? new Date(systemStatus.timestamp).toLocaleString() : 'N/A'}
                </div>
            </div>

{/* Financial Report Card */}
<div style={{
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #f0f0f0'
}}>
    <h2 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        💰 Financial Report
    </h2>

    {financialLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner" style={{ width: '30px', height: '30px' }}></div>
        </div>
    ) : financial ? (
        <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Total Revenue</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f97315' }}>
    Rs {Number(financial.totalRevenue || 0).toLocaleString()}
</div>
                </div>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Tickets Sold</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f97315' }}>
                        {Number(financial.totalTicketsSold || 0).toLocaleString()}
                    </div>
                </div>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Avg Ticket Price</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f97315' }}>
                       Rs {Number(financial.avgTicketPrice || 0).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Top Movies */}
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>🎬 Top Movies</h3>
                    {financial.topMovies?.length > 0 ? (
                        <div style={{ background: '#f9fafb', borderRadius: '12px', overflow: 'hidden' }}>
                            {financial.topMovies.map((movie, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    borderBottom: idx < financial.topMovies.length - 1 ? '1px solid #e5e7eb' : 'none'
                                }}>
                                    <span style={{ fontWeight: '500' }}>{movie.name}</span>
                                    <span style={{ color: '#f97315', fontWeight: '600' }}>Rs {Number(movie.revenue || 0).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
                            No data yet
                        </div>
                    )}
                </div>

                {/* Top Theaters */}
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>🏢 Top Theaters</h3>
                    {financial.topTheaters?.length > 0 ? (
                        <div style={{ background: '#f9fafb', borderRadius: '12px', overflow: 'hidden' }}>
                            {financial.topTheaters.map((theater, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    borderBottom: idx < financial.topTheaters.length - 1 ? '1px solid #e5e7eb' : 'none'
                                }}>
                                    <span style={{ fontWeight: '500' }}>{theater.name}</span>
                                    <span style={{ color: '#f97315', fontWeight: '600' }}>Rs {Number(theater.revenue || 0).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
                            No data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Monthly Revenue Chart (simple bar) */}
            <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>📊 Monthly Revenue</h3>
                <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem' }}>
                    {financial.monthlyRevenue?.map((month, idx) => {
                        const maxRevenue = Math.max(...financial.monthlyRevenue.map(m => m.revenue), 1);
                        const percentage = (month.revenue / maxRevenue) * 100;
                        return (
                            <div key={idx} style={{ marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span>{month.month}</span>
                                    <span>Rs {Number(month.revenue || 0).toLocaleString()}</span>
                                </div>
                                <div style={{ background: '#e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${percentage}%`,
                                        background: '#f97315',
                                        height: '8px',
                                        borderRadius: '8px'
                                    }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    ) : (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            No financial data available
        </div>
    )}
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