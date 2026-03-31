import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ViewHotels from './components/ViewHotels'
import HotelDetail from './components/HotelDetail'
import Login from './components/Login'
import Register from './components/Register'
import MyBookings from './components/MyBookings'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import AddHotel from './components/AddHotel'
import ManageUsers from './components/ManageUsers'
import PrivateRoutes from './components/PrivateRoutes'
import AdminPrivateRoutes from './components/AdminPrivateRoutes'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ViewHotels />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminPrivateRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-hotel" element={<AddHotel />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </>
  )
}

export default App