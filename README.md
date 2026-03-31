# LuxeStay Hotels — Full Stack Hotel Booking App

A production-ready hotel booking web application with Razorpay payment integration.

## Tech Stack

- **Frontend:** React 18, Vite, Material UI, React Router v6, Axios
- **Backend:** Node.js, Express 4, MongoDB (Mongoose), JWT Auth, Multer
- **Payments:** Razorpay (order creation + signature verification)
- **Maps:** OpenStreetMap (no API key required)

---

## Setup Instructions

### 1. Clone / Unzip the project

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/HotelDB
JWT_SECRET=your_strong_jwt_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

Start the backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**  
Backend runs on **http://localhost:5000**

---

## Razorpay Integration

1. Sign up at [razorpay.com](https://razorpay.com) and get test keys
2. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `backend/.env`
3. Payment flow:
   - User selects dates → booking created (`pending`)
   - Razorpay order created server-side → checkout popup opens
   - On success, signature verified server-side → booking marked `confirmed` + `paid`

## User Roles

| Role  | Access |
|-------|--------|
| Guest | Browse hotels |
| User  | Book hotels, view/cancel bookings (requires admin approval) |
| Admin | Manage hotels, users, view all bookings & revenue |

## Bug Fixes Applied

- Fixed hotel model field names (`city`→`location`, `images`→`image`, enabled `category`)
- Fixed API route paths (`/user/login` → `/users/login`, `/user/register` → `/users/register`)
- Added Razorpay **signature verification** in `/payment/verify` (security fix)
- Added `razorpaySignature` field to booking model
- Replaced broken Google Maps (placeholder key) with **OpenStreetMap iframe** (no key needed)
- Fixed all frontend components referencing wrong model fields (`hotel.image`, `hotel.location`)
- Added `start` script to backend `package.json`
- Added all missing frontend dependencies (MUI, axios, react-router-dom)
- Fixed `BookingForm` to send `razorpaySignature` to verify endpoint
- Added proper error handling, loading states, and empty states throughout
- Fixed date validation (check-out must be after check-in)
- Added Razorpay SDK availability check before opening checkout
- Used stable npm package versions (Express 4, React 18, Vite 5)
