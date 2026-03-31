const express = require('express');
const router = express.Router();
const Booking = require('../models/bookingModel');
const Hotel = require('../models/hotelModel');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// CREATE booking
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut, guests } = req.body;
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        const nights = Math.ceil(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        );
        if (nights < 1) return res.status(400).json({ message: 'Invalid dates' });

        const totalAmount = nights * hotel.pricePerNight * guests;

        const booking = new Booking({
            userId: req.user.id,
            hotelId,
            checkIn,
            checkOut,
            guests,
            totalAmount,
        });
        const newBooking = await booking.save();
        res.status(201).json({ message: 'Booking created', newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
});

// GET my bookings (user)
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate('hotelId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
});

// GET all bookings (admin)
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().populate('hotelId').populate('userId', 'username email');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all bookings', error });
    }
});

// CANCEL booking
router.put('/cancel/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { bookingStatus: 'cancelled' },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
});

module.exports = router;