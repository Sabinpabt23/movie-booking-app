'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMessages() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/messages/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.message_id === id ? { ...msg, status: 'read' } : msg
        ));
        if (selectedMessage?.message_id === id) {
          setSelectedMessage({ ...selectedMessage, status: 'read' });
        }
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setMessages(messages.filter(msg => msg.message_id !== id));
        if (selectedMessage?.message_id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Format date
  const formatDate = (date) => {
    const msgDate = new Date(date);
    const now = new Date();
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    return msgDate.toLocaleDateString();
  };

  // Filter and search messages
  const filteredMessages = messages.filter(msg => {
    // Status filter
    if (filter !== 'all' && msg.status !== filter) {
      return false;
    }
    
    // Search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        msg.name?.toLowerCase().includes(searchLower) ||
        msg.email?.toLowerCase().includes(searchLower) ||
        msg.message?.toLowerCase().includes(searchLower) ||
        msg.category?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'booking': '#3b82f6',
      'payment': '#f59e0b',
      'theater': '#10b981',
      'account': '#8b5cf6',
      'technical': '#ef4444',
      'feedback': '#ec4899'
    };
    return colors[category?.toLowerCase()] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ color: '#6b7280' }}>Loading messages...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {/* Left Panel - Message List */}
      <div style={{ 
        flex: '1', 
        background: 'white', 
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid #f0f0f0',
          background: '#f9fafb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1f2937' }}>Messages</h2>
            <span style={{ 
              background: '#f97315', 
              color: 'white', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px',
              fontSize: '0.8rem'
            }}>
              {messages.filter(m => m.status === 'unread').length} Unread
            </span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                paddingLeft: '2.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.95rem'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}>🔍</span>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'unread', 'read'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: filter === f ? '#f97315' : '#f3f4f6',
                  color: filter === f ? 'white' : '#4b5563',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textTransform: 'capitalize'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.message_id}
                onClick={() => setSelectedMessage(msg)}
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  background: selectedMessage?.message_id === msg.message_id ? '#fff6e9' : 'white',
                  borderLeft: selectedMessage?.message_id === msg.message_id ? '3px solid #f97315' : '3px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {msg.status === 'unread' && (
                      <span style={{ color: '#f97315', fontSize: '0.8rem' }}>●</span>
                    )}
                    <span style={{ fontWeight: msg.status === 'unread' ? '600' : '400' }}>
                      {msg.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{formatDate(msg.created_at)}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    background: getCategoryColor(msg.category),
                    color: 'white',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem'
                  }}>
                    {msg.category}
                  </span>
                </div>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: '#6b7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {msg.message?.substring(0, 60)}...
                </p>
              </div>
            ))
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
              No messages found
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Message Detail */}
      <div style={{ 
        flex: '1.5', 
        background: 'white', 
        borderRadius: '12px',
        padding: '2rem',
        overflowY: 'auto'
      }}>
        {selectedMessage ? (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1f2937' }}>Message Details</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedMessage.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(selectedMessage.message_id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(selectedMessage.message_id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Message Info */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>From</label>
                <div style={{ fontWeight: '500' }}>{selectedMessage.name}</div>
                <div style={{ color: '#6b7280' }}>{selectedMessage.email}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>Category</label>
                  <span style={{
                    background: getCategoryColor(selectedMessage.category),
                    color: 'white',
                    padding: '0.25rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    display: 'inline-block'
                  }}>
                    {selectedMessage.category}
                  </span>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>Date</label>
                  <div>{new Date(selectedMessage.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem' }}>Message</label>
                <div style={{
                  background: '#f9fafb',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
          }}>
            Select a message to view details
          </div>
        )}
      </div>
    </div>
  );
}