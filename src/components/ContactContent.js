'use client';
import { useState } from 'react';


export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          category: '',
          message: ''
        });
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Contact Hero Section */}
      <section className="contact-hero">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          Have questions about movie bookings, theaters, or anything else? We're here to help!
        </p>
      </section>

      {/* Contact Content */}
      <div className="contact-container">
        {/* Left Side - Contact Info */}
        <div className="contact-info">
          <h3>Contact Information</h3>
          
          <div className="contact-info-item">
            <div className="contact-info-icon">📍</div>
            <div className="contact-info-text">
              <h4>Visit Us</h4>
              <p>Putalisadak, Kathmandu<br />Nepal</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">📞</div>
            <div className="contact-info-text">
              <h4>Call Us</h4>
              <p>+977 9845943810<br />Mon - Fri, 9am - 6pm</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">✉️</div>
            <div className="contact-info-text">
              <h4>Email Us</h4>
              <p>support@sabinbooking.com<br />info@sabinbooking.com</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">⏰</div>
            <div className="contact-info-text">
              <h4>Working Hours</h4>
              <p>Monday - Friday: 9am - 6pm<br />Saturday: 10am - 4pm<br />Sunday: Closed</p>
            </div>
          </div>

          {/* Social Media Links */}
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="#" style={{ color: '#f97315', fontSize: '1.5rem' }}>📘</a>
              <a href="#" style={{ color: '#f97315', fontSize: '1.5rem' }}>🐦</a>
              <a href="#" style={{ color: '#f97315', fontSize: '1.5rem' }}>📷</a>
              <a href="#" style={{ color: '#f97315', fontSize: '1.5rem' }}>🎬</a>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form">
          <h3>Send us a Message</h3>
          
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Query Related To</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a category</option>
                <option value="booking">Movie Booking</option>
                <option value="theater">Theater Information</option>
                <option value="payment">Payment Issues</option>
                <option value="account">Account Related</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback/Suggestions</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Please describe your query in detail..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}