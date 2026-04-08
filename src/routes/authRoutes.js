/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - user_email
 *               - user_password
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: John Doe
 *               user_email:
 *                 type: string
 *                 example: john@example.com
 *               user_password:
 *                 type: string
 *                 example: password123
 *               user_phone:
 *                 type: string
 *                 example: 9841234567
 *               user_dob:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_email
 *               - user_password
 *             properties:
 *               user_email:
 *                 type: string
 *                 example: john@example.com
 *               user_password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models');
const crypto = require('crypto');

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        session: false
    })
);

// Google callback with custom handler
router.get('/google/callback', async (req, res) => {
    console.log('Google callback received');
    
    passport.authenticate('google', { session: false }, async (err, user, info) => {
        try {
            console.log('Passport authenticate callback');
            
            if (err) {
                console.error('Passport error:', err);
                return res.redirect('/login?error=auth_failed');
            }
            
            if (!user) {
                console.log('No user found');
                return res.redirect('/login?error=no_user');
            }
            
            console.log('User found:', user.user_email);
            
            // Generate access token
            const accessToken = jwt.sign(
                { user_id: user.user_id, user_email: user.user_email, type: 'access' },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );
            
            // Generate refresh token
            const refreshTokenString = crypto.randomBytes(40).toString('hex');
            const refreshTokenExpiry = new Date();
            refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
            
            await RefreshToken.create({
                user_id: user.user_id,
                token: refreshTokenString,
                expires_at: refreshTokenExpiry,
                device_info: req.headers['user-agent'] || 'unknown'
            });
            
            console.log('Tokens generated');
            
            // Prepare user data for frontend
            const userData = {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_phone: user.user_phone,
                user_dob: user.user_dob,
                user_reg_date: user.user_reg_date,
                profile_picture: user.avatar || user.profile_picture
            };
            
            // Encode user data to pass in URL
            const encodedUserData = encodeURIComponent(JSON.stringify(userData));
            
            // Redirect to frontend dashboard with tokens AND user data
            const frontendUrl = process.env.NODE_ENV === 'production'
                ? process.env.FRONTEND_URL
                : 'http://localhost:3000';
            
            const redirectUrl = `${frontendUrl}/dashboard#access_token=${accessToken}&refresh_token=${refreshTokenString}&user=${encodedUserData}`;
            console.log('Redirecting to:', redirectUrl);
            
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('Google auth error:', error);
            return res.redirect('/login?error=auth_failed');
        }
    })(req, res);
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;