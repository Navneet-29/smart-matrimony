const router = require('express').Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// UPDATE USER
router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can update only your account!");
    }
});

// GET USER
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
