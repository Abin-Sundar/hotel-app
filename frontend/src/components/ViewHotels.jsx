import React, { useEffect, useState } from 'react'
import axios from 'axios'
import HotelCard from './HotelCard'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

const ViewHotels = () => {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchHotels()
  }, [category])

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category) params.category = category
      const res = await axios.get('http://localhost:5000/hotels', { params })
      setHotels(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', px: { xs: 2, md: 6 }, py: 4 }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', py: 6, mb: 4 }}>
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
          Find Your Perfect <span style={{ color: '#e94560' }}>Stay</span>
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
          Discover handpicked luxury hotels across the world
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField placeholder="Search hotels or locations..." value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 200, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, background: 'rgba(255,255,255,0.05)' } }} />
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel sx={{ color: 'rgba(255,255,255,0.6)' }}>Category</InputLabel>
          <Select value={category} label="Category" onChange={e => setCategory(e.target.value)}
            sx={{ color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, background: 'rgba(255,255,255,0.05)' }}>
            <MenuItem value="">All</MenuItem>
            {['Budget', 'Standard', 'Luxury', 'Resort', 'Boutique'].map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Hotel Cards */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#e94560' }} /></Box>
      ) : filtered.length === 0 ? (
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', mt: 8, fontSize: '1.2rem' }}>
          No hotels found. Try a different search.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map(hotel => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={hotel._id}>
              <HotelCard hotel={hotel} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default ViewHotels