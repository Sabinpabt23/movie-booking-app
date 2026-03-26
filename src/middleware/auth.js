const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.user_id, {
            attributes: ['user_id', 'user_name', 'user_email', 'user_phone', 'user_dob', 'user_reg_date', 'is_locked']
        });

        if (!user) {
            throw new Error();
        }

        // Check if account is locked
        if (user.is_locked) {
            return res.status(403).json({ 
                message: 'Your account has been locked. Please contact admin for assistance.',
                isLocked: true
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = auth;