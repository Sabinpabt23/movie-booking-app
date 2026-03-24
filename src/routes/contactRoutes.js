/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact message endpoints
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - category
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               category:
 *                 type: string
 *                 enum: [booking, theater, payment, account, technical, feedback, other]
 *               message:
 *                 type: string
 *                 example: I need help with my booking
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/admin/messages:
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/messages/{id}/read:
 *   put:
 *     summary: Mark message as read (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */

/**
 * @swagger
 * /api/admin/messages/{id}:
 *   delete:
 *     summary: Delete message (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 */


const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/contact', contactController.submitMessage);
router.get('/contact/messages', contactController.getAllMessages);
router.put('/contact/messages/:id/read', contactController.markAsRead);
router.delete('/contact/messages/:id', contactController.deleteMessage);

module.exports = router;