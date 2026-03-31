const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { verifyAdmin } = require('../middleware/authMiddleware');

// ADMIN LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const admintoken = jwt.sign(
                { username, isAdmin: true },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            return res.status(200).json({ message: 'Admin login successful', admintoken });
        }
        return res.status(401).json({ message: 'Invalid admin credentials' });
    } catch (error) {
        res.status(500).json({ message: 'Admin login failed', error });
    }
});

// GET all pending users (admin only)
router.get('/pending-users', verifyAdmin, async (req, res) => {
    try {
        const pendingUsers = await User.find({ isApproved: false }).select('-password');
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending users', error });
    }
});

// GET all users (admin only)
router.get('/all-users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// APPROVE user (admin only)
router.put('/approve-user/:id', verifyAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: `User "${user.username}" approved successfully`, user });
    } catch (error) {
        res.status(500).json({ message: 'Error approving user', error });
    }
});

// REJECT / DELETE user (admin only)
router.delete('/delete-user/:id', verifyAdmin, async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

module.exports = router;