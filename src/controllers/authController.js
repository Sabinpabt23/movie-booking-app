const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
    try {
        const { user_name, user_email, user_password, user_phone, user_dob} = req.body;

        const existingUser = await User.findOne({ where: { user_email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);

        const newUser = await User.create({
            user_name,
            user_email,
            user_password: hashedPassword,
            user_phone,
            user_dob: user_dob || null,
            user_reg_date: new Date()
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                user_id: newUser.user_id,
                user_name: newUser.user_name,
                user_email: newUser.user_email,
                user_phone: newUser.user_phone,
                user_dob: newUser.user_dob,
                user_reg_date: newUser.user_reg_date
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;

        const user = await User.findOne({ where: { user_email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }


         // Check if account is locked
        if (user.is_locked) {
            return res.status(403).json({ 
                message: 'Your account has been locked. Please contact admin for assistance.' 
            });
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, user_email: user.user_email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return full user data including phone and dob
        res.json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_phone: user.user_phone,
                user_dob: user.user_dob,
                user_reg_date: user.user_reg_date
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { register, login };