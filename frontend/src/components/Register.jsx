import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import HotelIcon from '@mui/icons-material/Hotel'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) return setError('All fields required')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/users/register', form)
      setSuccess(res.data.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box component="form" onSubmit={handleRegister} sx={{ width: 420, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', p: 4, borderRadius: 3, textAlign: 'center' }}>
        <HotelIcon sx={{ fontSize: 50, color: '#e94560', mb: 1 }} />
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>Create Account</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>Register to explore luxury stays</Typography>
        {['username', 'email', 'password'].map((field) => (
          <TextField key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} name={field}
            type={field === 'password' ? 'password' : 'text'}
            value={form[field]} onChange={handleChange} fullWidth margin="normal"
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
            InputProps={{ style: { color: '#fff' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#e94560' } } }} />
        ))}
        {error && <Typography sx={{ color: '#e94560', mt: 1 }}>{error}</Typography>}
        {success && <Typography sx={{ color: '#4caf50', mt: 1 }}>{success}</Typography>}
        <Button type="submit" fullWidth variant="contained" disabled={loading}
          sx={{ mt: 3, py: 1.5, background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold', fontSize: '1rem' }}>
          {loading ? 'Registering...' : 'REGISTER'}
        </Button>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 2 }}>
          Already have an account? <Link to="/login" style={{ color: '#e94560' }}>Login</Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default Register
