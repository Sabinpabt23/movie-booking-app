const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const adminLogin = async (req, res) => {
    try {
        const { admin_email, admin_password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ where: { admin_email } });
        
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password using bcrypt (works for both hashed and plain text)
        const isMatch = await bcrypt.compare(admin_password, admin.admin_password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update last login
        await admin.update({ last_login: new Date() });

        // Create JWT token
        const token = jwt.sign(
            { 
                admin_id: admin.admin_id, 
                admin_email: admin.admin_email,
                admin_role: admin.admin_role,
                isAdmin: true 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Admin login successful',
            token,
            admin: {
                admin_id: admin.admin_id,
                admin_name: admin.admin_name,
                admin_email: admin.admin_email,
                admin_role: admin.admin_role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createAdmin = async (req, res) => {
    try {
        const { admin_name, admin_email, admin_password, admin_role } = req.body;

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ where: { admin_email } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(admin_password, 10);

        // Create admin
        const newAdmin = await Admin.create({
            admin_name,
            admin_email,
            admin_password: hashedPassword,
            admin_role: admin_role || 'admin'
        });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                admin_id: newAdmin.admin_id,
                admin_name: newAdmin.admin_name,
                admin_email: newAdmin.admin_email,
                admin_role: newAdmin.admin_role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    adminLogin,
    createAdmin
};