import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import HotelIcon from '@mui/icons-material/Hotel'
import PeopleIcon from '@mui/icons-material/People'
import BookOnlineIcon from '@mui/icons-material/BookOnline'
import DeleteIcon from '@mui/icons-material/Delete'

const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/40x40?text=H'
  if (image.startsWith('/uploads')) return `http://localhost:5000${image}`
  return image
}

const AdminDashboard = () => {
  const { adminToken } = useAuth()
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const headers = { token: adminToken }
    axios.get('http://localhost:5000/hotels').then(r => setHotels(r.data)).catch(console.error)
    axios.get('http://localhost:5000/admin/all-users', { headers }).then(r => setUsers(r.data)).catch(console.error)
    axios.get('http://localhost:5000/bookings/all', { headers }).then(r => setBookings(r.data)).catch(console.error)
  }, [adminToken])

  const deleteHotel = async (id) => {
    if (!window.confirm('Delete this hotel?')) return
    try {
      await axios.delete(`http://localhost:5000/hotels/delete/${id}`, { headers: { token: adminToken } })
      setHotels(hotels.filter(h => h._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting hotel')
    }
  }

  const revenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((s, b) => s + (b.totalAmount || 0), 0)

  const stats = [
    { label: 'Total Hotels', value: hotels.length, icon: <HotelIcon sx={{ fontSize: 40, color: '#e94560' }} /> },
    { label: 'Total Users', value: users.length, icon: <PeopleIcon sx={{ fontSize: 40, color: '#4fc3f7' }} /> },
    { label: 'Total Bookings', value: bookings.length, icon: <BookOnlineIcon sx={{ fontSize: 40, color: '#81c784' }} /> },
    { label: 'Revenue', value: `₹${revenue.toLocaleString()}`, icon: <span style={{ fontSize: 36 }}>💰</span> },
  ]

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', px: { xs: 2, md: 6 }, py: 4, color: '#fff' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>Admin Dashboard</Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {s.icon}
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{s.value}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Manage Hotels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Manage Hotels</Typography>
        <Button variant="contained" sx={{ background: '#e94560' }} onClick={() => navigate('/admin/add-hotel')}>+ Add Hotel</Button>
      </Box>
      <Box sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'auto', mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Hotel', 'Location', 'Category', 'Price/Night', 'Rating', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.map(hotel => (
              <TableRow key={hotel._id}>
                <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img
                      src={getImageUrl(hotel.image)}
                      alt={hotel.name}
                      style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                    />
                    {hotel.name}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{hotel.location}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {hotel.category ? (
                    <Chip label={hotel.category} size="small" sx={{ background: '#e94560', color: '#fff' }} />
                  ) : '—'}
                </TableCell>
                <TableCell sx={{ color: '#e94560', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{hotel.pricePerNight?.toLocaleString()}</TableCell>
                <TableCell sx={{ color: '#ffd700', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>★ {hotel.rating}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Button size="small" sx={{ color: '#e94560', minWidth: 'auto' }} onClick={() => deleteHotel(hotel._id)}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {hotels.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', py: 4, borderBottom: 'none' }}>
                  No hotels added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Recent Bookings */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Recent Bookings</Typography>
      <Box sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['User', 'Hotel', 'Check In', 'Check Out', 'Amount', 'Payment', 'Status'].map(h => (
                <TableCell key={h} sx={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.slice(0, 10).map(b => (
              <TableRow key={b._id}>
                <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{b.userId?.username || 'N/A'}</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{b.hotelId?.name || 'N/A'}</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{new Date(b.checkIn).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{new Date(b.checkOut).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: '#e94560', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{b.totalAmount?.toLocaleString()}</TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip label={b.paymentStatus} size="small"
                    sx={{ background: b.paymentStatus === 'paid' ? '#4caf50' : b.paymentStatus === 'failed' ? '#e94560' : '#ff9800', color: '#fff' }} />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Chip label={b.bookingStatus} size="small"
                    sx={{ background: b.bookingStatus === 'confirmed' ? '#1565c0' : b.bookingStatus === 'cancelled' ? '#b71c1c' : '#e65100', color: '#fff' }} />
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', py: 4, borderBottom: 'none' }}>
                  No bookings yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

export default AdminDashboard
