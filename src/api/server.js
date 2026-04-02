const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('../routes/contactRoutes');
const authRoutes = require('../routes/authRoutes');
const adminRoutes = require('../routes/adminRoutes');
const adminAuthRoutes = require('../routes/adminAuthRoutes');
const userRoutes = require('../routes/userRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const sequelize = require('../config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('../swagger');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Simple CORS - allow all origins (quick fix)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Database connection check
sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', bookingRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Test admin endpoint (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.post('/api/admin/login-test', async (req, res) => {
        console.log('Test endpoint hit!', req.body);
        res.json({ 
            message: 'Test endpoint works',
            received: req.body
        });
    });
}

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});