const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        console.error("Registration Error:", err);
        if (err.code === 11000) {
            return res.status(400).json("Username or Email already exists!");
        }
        res.status(500).json(err.message || "Something went wrong during registration");
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json("Wrong credentials!");

        if (user.password !== req.body.password) return res.status(401).json("Wrong credentials!");

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SEC || 'secret_key',
            { expiresIn: "5d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
