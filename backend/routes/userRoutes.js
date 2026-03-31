const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/authMiddleware');

// REGISTER user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser)
            return res.status(400).json({ message: 'Username or Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful! Await admin approval to login.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error });
    }
});

// LOGIN user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: 'Username and Password are required' });

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.isApproved)
            return res.status(403).json({ message: 'Account not yet approved by admin. Please wait.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const usertoken = jwt.sign(
            { id: user._id, username: user.username, isAdmin: false },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        res.status(200).json({ message: 'Login successful', usertoken, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
});

// GET current user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

module.exports = router;