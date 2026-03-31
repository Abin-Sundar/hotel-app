const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['Budget', 'Standard', 'Luxury', 'Resort', 'Boutique'],
        default: 'Standard',
    },
    pricePerNight: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    amenities: {
        type: [String],
        default: [],
    },
    image: {
        type: String,
        required: true,
    },
    availableRooms: {
        type: Number,
        required: true,
        default: 10,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('hotels', hotelSchema);