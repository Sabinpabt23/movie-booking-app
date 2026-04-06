const express = require('express');
const router = express.Router();
const refreshTokenController = require('../controllers/refreshTokenController');

router.post('/refresh', refreshTokenController.refreshAccessToken);
router.post('/logout', refreshTokenController.logout);

module.exports = router;