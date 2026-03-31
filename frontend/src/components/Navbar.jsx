import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import HotelIcon from '@mui/icons-material/Hotel'
import Box from '@mui/material/Box'

const Navbar = () => {
  const { token, adminToken, username, logoutUser, logoutAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  const handleAdminLogout = () => {
    logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <Toolbar>
        <HotelIcon sx={{ mr: 1, color: '#e94560' }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#fff', cursor: 'pointer' }} onClick={() => navigate('/')}>
          LuxeStay Hotels
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!token && !adminToken && (
            <>
              <Button color="inherit" component={Link} to="/">Explore</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
              <Button variant="outlined" sx={{ color: '#e94560', borderColor: '#e94560' }} component={Link} to="/admin/login">Admin</Button>
            </>
          )}
          {token && !adminToken && (
            <>
              <Button color="inherit" component={Link} to="/">Hotels</Button>
              <Button color="inherit" component={Link} to="/my-bookings">My Bookings</Button>
              <Typography sx={{ alignSelf: 'center', color: '#e94560', mr: 1 }}>Hi, {username}</Typography>
              <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} onClick={handleLogout}>Logout</Button>
            </>
          )}
          {adminToken && (
            <>
              <Button color="inherit" component={Link} to="/admin/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/admin/add-hotel">Add Hotel</Button>
              <Button color="inherit" component={Link} to="/admin/manage-users">Users</Button>
              <Button variant="outlined" sx={{ color: '#e94560', borderColor: '#e94560' }} onClick={handleAdminLogout}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar