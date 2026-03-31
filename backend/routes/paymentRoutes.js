const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/bookingModel');
const { verifyToken } = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', verifyToken, async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const options = {
            amount: Math.round(booking.totalAmount * 100), // paise
            currency: 'INR',
            receipt: `receipt_${bookingId}`,
        };

        const order = await razorpay.orders.create(options);
        await Booking.findByIdAndUpdate(bookingId, { razorpayOrderId: order.id });

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({ message: 'Error creating payment order', error: error.message });
    }
});

// Verify payment signature and confirm booking
router.post('/verify', verifyToken, async (req, res) => {
    try {
        const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

        // Verify signature
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        await Booking.findByIdAndUpdate(bookingId, {
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            paymentStatus: 'paid',
            bookingStatus: 'confirmed',
        });

        res.status(200).json({ message: 'Payment verified and booking confirmed' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
});

module.exports = router;
