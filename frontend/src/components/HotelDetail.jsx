import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import StarIcon from '@mui/icons-material/Star'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BookingForm from './BookingForm'

const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/800x400?text=Hotel'
  if (image.startsWith('/uploads')) return `http://localhost:5000${image}`
  return image
}

const HotelDetail = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`http://localhost:5000/hotels/${id}`)
      .then(res => setHotel(res.data))
      .catch(() => setError('Hotel not found'))
  }, [id])

  if (error) return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#e94560', fontSize: '1.2rem' }}>{error}</Typography>
    </Box>
  )

  if (!hotel) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress sx={{ color: '#e94560' }} />
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', px: { xs: 2, md: 8 }, py: 4, color: '#fff' }}>
      {/* Image */}
      <Box sx={{ borderRadius: 3, overflow: 'hidden', mb: 4, height: 400 }}>
        <img
          src={getImageUrl(hotel.image)}
          alt={hotel.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{hotel.name}</Typography>
            {hotel.category && (
              <Chip label={hotel.category} sx={{ background: '#e94560', color: '#fff', alignSelf: 'center', fontSize: '1rem', px: 1 }} />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ color: '#e94560', mr: 1 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{hotel.address || hotel.location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <StarIcon sx={{ color: '#ffd700', mr: 0.5 }} />
            <Typography sx={{ color: '#ffd700', fontWeight: 'bold' }}>{hotel.rating} / 5</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', ml: 2 }}>{hotel.availableRooms} rooms available</Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}>{hotel.description}</Typography>

          {hotel.amenities?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Amenities</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {hotel.amenities.map((a, i) => (
                  <Chip key={i} label={a} sx={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} />
                ))}
              </Box>
            </>
          )}

          {/* Static map fallback using OpenStreetMap iframe — no API key needed */}
          {hotel.latitude && hotel.longitude && (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Location on Map</Typography>
              <Box sx={{ borderRadius: 2, overflow: 'hidden', height: 300, mb: 4 }}>
                <iframe
                  title="Hotel Location"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.longitude - 0.01}%2C${hotel.latitude - 0.01}%2C${hotel.longitude + 0.01}%2C${hotel.latitude + 0.01}&layer=mapnik&marker=${hotel.latitude}%2C${hotel.longitude}`}
                />
              </Box>
            </>
          )}
        </Grid>

        {/* Booking Panel */}
        <Grid item xs={12} md={4}>
          <Box sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h4" sx={{ color: '#e94560', fontWeight: 'bold' }}>
              ₹{hotel.pricePerNight?.toLocaleString()}
              <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>/night</span>
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>Taxes and fees included</Typography>
            {showBooking ? (
              <BookingForm hotel={hotel} onClose={() => setShowBooking(false)} />
            ) : (
              <Button fullWidth variant="contained" size="large"
                sx={{ background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold', py: 1.5, fontSize: '1rem' }}
                onClick={() => token ? setShowBooking(true) : navigate('/login')}>
                {token ? 'Book Now' : 'Login to Book'}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HotelDetail
