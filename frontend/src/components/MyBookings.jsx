import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

const MyBookings = () => {
  const { token } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/bookings/my-bookings', { headers: { token } })
      .then(r => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await axios.put(`http://localhost:5000/bookings/cancel/${id}`, {}, { headers: { token } })
      setBookings(bookings.map(b => b._id === id ? { ...b, bookingStatus: 'cancelled' } : b))
    } catch (err) {
      alert(err.response?.data?.message || 'Error cancelling booking')
    }
  }

  if (loading) return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress sx={{ color: '#e94560' }} />
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', px: { xs: 2, md: 6 }, py: 4 }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>My Bookings</Typography>
      {bookings.length === 0 ? (
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 8, fontSize: '1.2rem' }}>
          No bookings yet. Start exploring hotels!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map(b => (
            <Grid item xs={12} md={6} key={b._id}>
              <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{b.hotelId?.name || 'Hotel'}</Typography>
                    <Chip label={b.bookingStatus} size="small"
                      sx={{
                        background: b.bookingStatus === 'confirmed' ? '#4caf50' : b.bookingStatus === 'cancelled' ? '#e94560' : '#ff9800',
                        color: '#fff',
                      }} />
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>📍 {b.hotelId?.location}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
                    📅 {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>👥 {b.guests} guest(s)</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: '#e94560', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      ₹{b.totalAmount?.toLocaleString()}
                    </Typography>
                    <Chip label={b.paymentStatus} size="small"
                      sx={{ background: b.paymentStatus === 'paid' ? '#4caf50' : '#ff9800', color: '#fff' }} />
                  </Box>
                  {b.bookingStatus !== 'cancelled' && (
                    <Button size="small" variant="outlined" sx={{ mt: 2, color: '#e94560', borderColor: '#e94560' }}
                      onClick={() => cancelBooking(b._id)}>
                      Cancel Booking
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default MyBookings
