'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTheaters() {
  const router = useRouter();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [formData, setFormData] = useState({
    theater_name: '',
    theater_location: '',
    halls: [{ hall_number: '', capacity: '' }]
  });

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/theaters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setTheaters(data);
    } catch (error) {
      console.error('Error fetching theaters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleHallChange = (index, e) => {
    const newHalls = [...formData.halls];
    newHalls[index][e.target.name] = e.target.value;
    setFormData({ ...formData, halls: newHalls });
  };

  const addHallField = () => {
    setFormData({
      ...formData,
      halls: [...formData.halls, { hall_number: '', capacity: '' }]
    });
  };

  const removeHallField = (index) => {
    if (formData.halls.length > 1) {
      const newHalls = formData.halls.filter((_, i) => i !== index);
      setFormData({ ...formData, halls: newHalls });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const url = editingTheater 
        ? `${API_URL}/api/admin/theaters/${editingTheater.theater_id}`
        : `${API_URL}/api/admin/theaters`;
      
      const response = await fetch(url, {
        method: editingTheater ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        resetForm();
        fetchTheaters();
      }
    } catch (error) {
      console.error('Error saving theater:', error);
    }
  };

  const handleEdit = (theater) => {
    setEditingTheater(theater);
    setFormData({
      theater_name: theater.theater_name || '',
      theater_location: theater.theater_location || '',
      halls: theater.Halls?.length > 0 ? theater.Halls.map(h => ({
        hall_number: h.hall_number,
        capacity: h.hall_capacity
      })) : [{ hall_number: '', capacity: '' }]
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this theater?')) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/theaters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchTheaters();
      }
    } catch (error) {
      console.error('Error deleting theater:', error);
    }
  };

  const handleDeleteHall = async (hallId) => {
    if (!confirm('Are you sure you want to delete this hall?')) return;
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/admin/halls/${hallId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchTheaters();
      }
    } catch (error) {
      console.error('Error deleting hall:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTheater(null);
    setFormData({
      theater_name: '',
      theater_location: '',
      halls: [{ hall_number: '', capacity: '' }]
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937' }}>Theater Management</h1>
        <button 
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          style={{
            background: '#f97315',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Theater'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>
            {editingTheater ? 'Edit Theater' : 'Add New Theater'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                name="theater_name"
                placeholder="Theater Name"
                value={formData.theater_name}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                required
              />
              <input
                type="text"
                name="theater_location"
                placeholder="Location"
                value={formData.theater_location}
                onChange={handleInputChange}
                style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                required
              />
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Halls</h3>
            
            {formData.halls.map((hall, index) => (
              <div key={index} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr auto', 
                gap: '0.5rem', 
                marginBottom: '0.5rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  name="hall_number"
                  placeholder="Hall Number (e.g., Hall 1)"
                  value={hall.hall_number}
                  onChange={(e) => handleHallChange(index, e)}
                  style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                />
                <input
                  type="number"
                  name="capacity"
                  placeholder="Seating Capacity"
                  value={hall.capacity}
                  onChange={(e) => handleHallChange(index, e)}
                  style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeHallField(index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addHallField}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '0.5rem',
                marginBottom: '1.5rem'
              }}
            >
              + Add Another Hall
            </button>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{
                background: '#f97315',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                {editingTheater ? 'Update Theater' : 'Save Theater'}
              </button>
              {editingTheater && (
                <button type="button" onClick={resetForm} style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #f0f0f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Theater Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Halls</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Total Seats</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((theater) => {
                const totalSeats = theater.Halls?.reduce((sum, hall) => sum + hall.hall_capacity, 0) || 0;
                
                return (
                  <tr key={theater.theater_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '1rem' }}>{theater.theater_id}</td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{theater.theater_name}</td>
                    <td style={{ padding: '1rem' }}>{theater.theater_location}</td>
                    <td style={{ padding: '1rem' }}>
                      {theater.Halls?.map(hall => (
                        <div key={hall.hall_id} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          marginBottom: '0.25rem'
                        }}>
                          <span>{hall.hall_number} ({hall.hall_capacity} seats)</span>
                          <button
                            onClick={() => handleDeleteHall(hall.hall_id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '1rem' }}>{totalSeats}</td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleEdit(theater)}
                        style={{ 
                          background: '#3b82f6', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '4px', 
                          marginRight: '0.5rem', 
                          cursor: 'pointer' 
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(theater.theater_id)}
                        style={{ 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '4px', 
                          cursor: 'pointer' 
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}