import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid'

const AddHotel = () => {
  const { adminToken } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    location: '',
    address: '',
    latitude: '',
    longitude: '',
    category: 'Luxury',
    pricePerNight: '',
    rating: '',
    description: '',
    amenities: '',
    availableRooms: '',
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return setError('Please upload an image')
    if (Number(form.rating) < 0 || Number(form.rating) > 5) return setError('Rating must be between 0 and 5')
    setLoading(true)
    setError('')
    try {
      const data = new FormData()
      Object.keys(form).forEach(k => data.append(k, form[k]))
      data.append('image', image)
      await axios.post('http://localhost:5000/hotels/add', data, {
        headers: { token: adminToken, 'Content-Type': 'multipart/form-data' },
      })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding hotel')
    } finally {
      setLoading(false)
    }
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: '#e94560' },
    },
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', px: { xs: 2, md: 8 }, py: 4 }}>
      <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 4 }}>Add New Hotel</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, p: 4 }}
      >
        <Grid container spacing={2}>
          {[
            ['name', 'Hotel Name'],
            ['location', 'City / Location'],
            ['address', 'Full Address'],
            ['latitude', 'Latitude'],
            ['longitude', 'Longitude'],
            ['pricePerNight', 'Price Per Night (₹)'],
            ['rating', 'Rating (0–5)'],
            ['availableRooms', 'Available Rooms'],
          ].map(([name, label]) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
                name={name} label={label} value={form[name]} onChange={handleChange}
                fullWidth required
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                InputProps={{ style: { color: '#fff' } }}
                sx={inputSx}
              />
            </Grid>
          ))}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={inputSx}>
              <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Category</InputLabel>
              <Select name="category" value={form.category} label="Category" onChange={handleChange}
                sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}>
                {['Budget', 'Standard', 'Luxury', 'Resort', 'Boutique'].map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="amenities" label="Amenities (comma separated)" value={form.amenities}
              onChange={handleChange} fullWidth
              placeholder="WiFi, Pool, Gym, Spa"
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              InputProps={{ style: { color: '#fff' } }} sx={inputSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description" label="Description" value={form.description}
              onChange={handleChange} fullWidth multiline rows={4} required
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
              InputProps={{ style: { color: '#fff' } }} sx={inputSx}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>Hotel Image *</Typography>
            <Button variant="outlined" component="label" sx={{ color: '#e94560', borderColor: '#e94560' }}>
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {preview && (
              <Box component="img" src={preview} sx={{ display: 'block', mt: 2, maxHeight: 200, borderRadius: 2 }} />
            )}
          </Grid>
        </Grid>
        {error && <Typography sx={{ color: '#e94560', mt: 2 }}>{error}</Typography>}
        <Button
          type="submit" variant="contained" size="large" disabled={loading}
          sx={{ mt: 3, px: 5, background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold' }}
        >
          {loading ? 'Adding Hotel...' : 'Add Hotel'}
        </Button>
      </Box>
    </Box>
  )
}

export default AddHotel
