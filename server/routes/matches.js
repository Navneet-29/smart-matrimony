const router = require('express').Router();
const User = require('../models/User');
const Connection = require('../models/Connection');
const { verifyToken } = require('../middleware/auth');

// GET MATCHES
router.get('/suggested', verifyToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (!currentUser) return res.status(404).json("User not found");

        const allUsers = await User.find({ _id: { $ne: currentUser._id } });

        const myConnections = await Connection.find({
            $or: [{ requester: req.user.id }, { recipient: req.user.id }]
        });

        // Filter out users we have already rejected or connected with
        const validUsers = allUsers.filter(user => {
            const hasRejectedConnection = myConnections.some(conn => 
                (conn.requester.toString() === req.user.id && conn.recipient.toString() === user._id.toString() && conn.status === 'rejected') ||
                (conn.recipient.toString() === req.user.id && conn.requester.toString() === user._id.toString() && conn.status === 'rejected')
            );
            return !hasRejectedConnection;
        });

        const scoredMatches = validUsers.map(user => {
            let score = 0;
            const weights = currentUser.preferences?.weights || { religion: 30, education: 40, location: 30 };
            const prefs = currentUser.preferences || {};

            if (prefs.preferredReligion && user.personalDetails?.religion === prefs.preferredReligion) score += weights.religion;
            if (prefs.preferredEducation && user.education?.degree === prefs.preferredEducation) score += weights.education;
            if (prefs.preferredGender && user.personalDetails?.gender !== prefs.preferredGender) score -= 100;
            if (currentUser.personalDetails?.location && user.personalDetails?.location === currentUser.personalDetails.location) score += weights.location;

            score = Math.max(0, Math.min(100, score));

            const connection = myConnections.find(conn =>
                (conn.requester.toString() === req.user.id && conn.recipient.toString() === user._id.toString()) ||
                (conn.recipient.toString() === req.user.id && conn.requester.toString() === user._id.toString())
            );

            let connectionStatus = 'none';
            let isRequester = false;

            if (connection) {
                connectionStatus = connection.status;
                isRequester = connection.requester.toString() === req.user.id;
            }

            return { ...user._doc, matchScore: score, connectionStatus, isRequester };
        });

        scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
        res.status(200).json(scoredMatches);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
