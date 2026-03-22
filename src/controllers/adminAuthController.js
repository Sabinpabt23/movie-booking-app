const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const adminLogin = async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        
        const { admin_email, admin_password } = req.body;
        console.log('Email:', admin_email);
        console.log('Password provided:', admin_password);

        // Find admin by email
        const admin = await Admin.findOne({ where: { admin_email } });
        console.log('Admin found:', admin ? 'Yes' : 'No');
        
        if (!admin) {
            console.log('Admin not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Stored password:', admin.admin_password);
        
        // Compare password (temporary plain text comparison)
        const isMatch = (admin_password === admin.admin_password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

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