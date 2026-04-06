const jwt = require('jsonwebtoken');
const { RefreshToken, User } = require('../models');

const refreshAccessToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({ message: 'Refresh token required' });
        }

        // Find the refresh token in database
        const storedToken = await RefreshToken.findOne({
            where: { token: refresh_token, revoked: false },
            include: [{ model: User }]
        });

        if (!storedToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Check if token is expired
        if (new Date() > storedToken.expires_at) {
            await storedToken.update({ revoked: true });
            return res.status(401).json({ message: 'Refresh token expired. Please login again.' });
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
            { 
                user_id: storedToken.User.user_id, 
                user_email: storedToken.User.user_email, 
                type: 'access' 
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Optional: Rotate refresh token (generate new one)
        const crypto = require('crypto');
        const newRefreshToken = crypto.randomBytes(40).toString('hex');
        const newRefreshTokenExpiry = new Date();
        newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 7);

        // Revoke old token and create new one (token rotation)
        await storedToken.update({ revoked: true });
        
        await RefreshToken.create({
            user_id: storedToken.user_id,
            token: newRefreshToken,
            expires_at: newRefreshTokenExpiry,
            device_info: req.headers['user-agent'] || 'unknown'
        });

        res.json({
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            expires_in: 900
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (refresh_token) {
            await RefreshToken.update(
                { revoked: true },
                { where: { token: refresh_token } }
            );
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { refreshAccessToken, logout };