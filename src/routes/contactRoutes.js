const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/contact', contactController.submitMessage);
router.get('/contact/messages', contactController.getAllMessages);
router.put('/contact/messages/:id/read', contactController.markAsRead);
router.delete('/contact/messages/:id', contactController.deleteMessage);

module.exports = router;