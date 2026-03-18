const { ContactMessage } = require('../models');

const submitMessage = async (req, res) => {
    try {
        const { name, email, category, message } = req.body;

        if (!name || !email || !category || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newMessage = await ContactMessage.create({
            name,
            email,
            category,
            message,
            status: 'unread',
            created_at: new Date()
        });

        res.status(201).json({ 
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await ContactMessage.findByPk(id);
        
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.status = 'read';
        await message.save();

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await ContactMessage.findByPk(id);
        
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.destroy();
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    submitMessage,
    getAllMessages,
    markAsRead,
    deleteMessage
};