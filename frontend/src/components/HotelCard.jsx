import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import StarIcon from '@mui/icons-material/Star'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/400x200?text=Hotel'
  if (image.startsWith('/uploads')) return `http://localhost:5000${image}`
  return image
}

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/hotel/${hotel._id}`)} sx={{
      cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 2, color: '#fff', transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 12px 40px rgba(233,69,96,0.3)' }
    }}>
      <CardMedia component="img" height="200"
        image={getImageUrl(hotel.image)}
        alt={hotel.name} sx={{ objectFit: 'cover' }} />
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', lineHeight: 1.2 }}>{hotel.name}</Typography>
          {hotel.category && (
            <Chip label={hotel.category} size="small" sx={{ background: '#e94560', color: '#fff', ml: 1 }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon sx={{ fontSize: 16, color: '#e94560', mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{hotel.location}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <StarIcon sx={{ fontSize: 16, color: '#ffd700', mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: '#ffd700' }}>{hotel.rating}/5</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {hotel.description}
        </Typography>
        <Typography variant="h6" sx={{ color: '#e94560', fontWeight: 'bold' }}>
          ₹{hotel.pricePerNight?.toLocaleString()}<span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>/night</span>
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button fullWidth variant="contained"
          sx={{ background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold' }}>
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}

export default HotelCard
