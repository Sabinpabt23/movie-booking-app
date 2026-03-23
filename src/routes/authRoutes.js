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

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;