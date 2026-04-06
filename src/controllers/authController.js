const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const RefreshToken = require('../models/RefreshToken');

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

        if (user.is_locked) {
            return res.status(403).json({ 
                message: 'Your account has been locked. Please contact admin for assistance.' 
            });
        }

        const isMatch = await bcrypt.compare(user_password, user.user_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate Access Token (short lived - 15 minutes)
        const accessToken = jwt.sign(
            { user_id: user.user_id, user_email: user.user_email, type: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Generate Refresh Token (long lived - 7 days)
        const refreshTokenString = RefreshToken.generateToken();
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

        await RefreshToken.create({
            user_id: user.user_id,
            token: refreshTokenString,
            expires_at: refreshTokenExpiry,
            device_info: req.headers['user-agent'] || 'unknown'
        });

        res.json({
            message: 'Login successful',
            access_token: accessToken,
            refresh_token: refreshTokenString,
            token: accessToken,
            expires_in: 900, // 15 minutes in seconds
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_phone: user.user_phone,
                user_dob: user.user_dob,
                user_reg_date: user.user_reg_date,
                profile_picture: user.profile_picture
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { register, login };