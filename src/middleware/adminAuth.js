const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's an admin token
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const admin = await Admin.findByPk(decoded.admin_id);

        if (!admin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        req.admin = admin;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = adminAuth;