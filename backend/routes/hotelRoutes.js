const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotelModel');
const { verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET all hotels (public)
router.get('/', async (req, res) => {
    try {
        const { category, location, minPrice, maxPrice, minRating } = req.query;
        let filter = {};
        if (category) filter.category = category;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
        }
        if (minRating) filter.rating = { $gte: Number(minRating) };
        const hotels = await Hotel.find(filter);
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hotels', error });
    }
});

// GET single hotel by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ message: 'Invalid ID or server error', error });
    }
});

// ADD new hotel (admin only) with image upload
router.post('/add', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;
        const amenitiesArray = req.body.amenities
            ? req.body.amenities.split(',').map((a) => a.trim())
            : [];
        const hotel = new Hotel({
            name: req.body.name,
            location: req.body.location,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            category: req.body.category,
            pricePerNight: req.body.pricePerNight,
            rating: req.body.rating,
            description: req.body.description,
            amenities: amenitiesArray,
            image: imagePath,
            availableRooms: req.body.availableRooms,
        });
        const newHotel = await hotel.save();
        res.status(201).json({ message: 'Hotel added successfully', newHotel });
    } catch (error) {
        res.status(500).json({ message: 'Error adding hotel', error });
    }
});

// UPDATE hotel (admin only) with optional image upload
router.put('/update/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) updateData.image = `/uploads/${req.file.filename}`;
        if (updateData.amenities && typeof updateData.amenities === 'string') {
            updateData.amenities = updateData.amenities.split(',').map((a) => a.trim());
        }
        const updated = await Hotel.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updated) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json({ message: 'Hotel updated successfully', updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating hotel', error });
    }
});

// DELETE hotel (admin only)
router.delete('/delete/:id', verifyAdmin, async (req, res) => {
    try {
        const deleted = await Hotel.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting hotel', error });
    }
});

module.exports = router;