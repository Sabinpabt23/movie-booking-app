const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('../routes/contactRoutes');
const authRoutes = require('../routes/authRoutes');
const adminRoutes = require('../routes/adminRoutes');
const adminAuthRoutes = require('../routes/adminAuthRoutes');
const userRoutes = require('../routes/userRoutes');

const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use('/api/user', userRoutes);

app.use('/api/admin/auth', adminAuthRoutes);

app.use('/api/auth', authRoutes);

app.use('/api', contactRoutes);

app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});