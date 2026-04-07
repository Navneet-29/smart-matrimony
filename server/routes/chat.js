const router = require('express').Router();
const Message = require('../models/Message');
const Connection = require('../models/Connection');
const { verifyToken } = require('../middleware/auth');

// SEND MESSAGE
router.post('/send', verifyToken, async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user.id;

        // Verify if they are connected (must be 'accepted')
        const connection = await Connection.findOne({
            $or: [
                { requester: senderId, recipient: recipientId },
                { requester: recipientId, recipient: senderId }
            ],
            status: 'accepted'
        });

        if (!connection) {
            return res.status(403).json("You can only message users you are connected with.");
        }

        const newMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            text: text
        });

        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET CONVERSATION HISTORY
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const myId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: myId, recipient: otherUserId },
                { sender: otherUserId, recipient: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
