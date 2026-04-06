const router = require('express').Router();
const Connection = require('../models/Connection');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// SEND CONNECTION REQUEST (Swipe Right)
router.post('/request/:id', verifyToken, async (req, res) => {
    try {
        const recipientId = req.params.id;
        const requesterId = req.user.id;

        if (recipientId === requesterId) return res.status(400).json("You cannot connect with yourself");

        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingConnection) {
            if(existingConnection.status === 'rejected') {
                 // if previously rejected, we can update it to pending if we are requester? 
                 // Let's just say connection exists.
                 return res.status(400).json("Connection already exists");
            }
            return res.status(400).json("Connection already exists or is pending");
        }

        const newConnection = new Connection({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });
        await newConnection.save();

        const sender = await User.findById(requesterId);
        const newNotification = new Notification({
            recipient: recipientId,
            sender: requesterId,
            type: 'connection_request',
            message: `${sender.personalDetails?.fullname || sender.username} sent you a connection request.`
        });
        await newNotification.save();

        res.status(200).json("Connection request sent");
    } catch (err) {
        res.status(500).json(err);
    }
});

// REJECT CONNECTION (Swipe Left)
router.post('/reject/:id', verifyToken, async (req, res) => {
    try {
        const recipientId = req.params.id; // person being rejected
        const requesterId = req.user.id;

        const existingConnection = await Connection.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existingConnection) {
            existingConnection.status = 'rejected';
            await existingConnection.save();
        } else {
            const newConnection = new Connection({
                requester: requesterId,
                recipient: recipientId,
                status: 'rejected'
            });
            await newConnection.save();
        }

        res.status(200).json("User rejected/skipped");
    } catch (err) {
        res.status(500).json(err);
    }
});

// ACCEPT CONNECTION REQUEST
router.post('/accept/:id', verifyToken, async (req, res) => {
    try {
        const requesterId = req.params.id;
        const recipientId = req.user.id;

        const connection = await Connection.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: 'pending'
        });

        if (!connection) return res.status(404).json("Connection request not found");

        connection.status = 'accepted';
        await connection.save();

        const acceptor = await User.findById(recipientId);
        const newNotification = new Notification({
            recipient: requesterId,
            sender: recipientId,
            type: 'connection_accepted',
            message: `${acceptor.personalDetails?.fullname || acceptor.username} accepted your connection request.`
        });
        await newNotification.save();

        res.status(200).json("Connection accepted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET MY NOTIFICATIONS
router.get('/notifications', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .populate('sender', 'username personalDetails.fullname personalDetails.profilePic');
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json(err);
    }
});

// MARK NOTIFICATION AS READ
router.put('/notifications/:id/read', verifyToken, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { $set: { read: true } });
        res.status(200).json("Notification marked as read");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
