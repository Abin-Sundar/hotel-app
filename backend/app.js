const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const connectDB = require('./db');

const hotelRoutes = require('./routes/hotelRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use(cors({ origin: 'https://hotel-app-frontend-fax4.onrender.com'}));
app.use(express.json());

// Serve uploaded images statically
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/hotels', hotelRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payment', paymentRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
