/**
 * @swagger
 * tags:
 *   name: AdminAuth
 *   description: Admin authentication endpoints
 */

/**
 * @swagger
 * /api/admin/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [AdminAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admin_email
 *               - admin_password
 *             properties:
 *               admin_email:
 *                 type: string
 *                 example: admin@example.com
 *               admin_password:
 *                 type: string
 *                 example: admin123
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
 *                 admin:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/admin/auth/create:
 *   post:
 *     summary: Create new admin (super admin only)
 *     tags: [AdminAuth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admin_name
 *               - admin_email
 *               - admin_password
 *             properties:
 *               admin_name:
 *                 type: string
 *               admin_email:
 *                 type: string
 *               admin_password:
 *                 type: string
 *               admin_role:
 *                 type: string
 *                 enum: [super_admin, admin]
 *     responses:
 *       201:
 *         description: Admin created
 *       400:
 *         description: Email already registered
 *       401:
 *         description: Unauthorized
 */


const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');

router.post('/login', adminAuthController.adminLogin);
router.post('/create', adminAuthController.createAdmin);

module.exports = router;