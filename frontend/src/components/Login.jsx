import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import HotelIcon from '@mui/icons-material/Hotel'

const Login = () => {
  const navigate = useNavigate()
  const { loginUser } = useAuth()
  const [user, setUser] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!user.username || !user.password) return setError('All fields required')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:5000/users/login', user)
      loginUser(res.data.usertoken, res.data.username)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box component="form" onSubmit={handleLogin} sx={{ width: 420, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', p: 4, borderRadius: 3, textAlign: 'center' }}>
        <HotelIcon sx={{ fontSize: 50, color: '#e94560', mb: 1 }} />
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>Welcome Back</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>Sign in to your account</Typography>
        <TextField label="Username" name="username" value={user.username} onChange={handleChange} fullWidth margin="normal"
          InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
          InputProps={{ style: { color: '#fff' } }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#e94560' } } }} />
        <TextField label="Password" name="password" type="password" value={user.password} onChange={handleChange} fullWidth margin="normal"
          InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
          InputProps={{ style: { color: '#fff' } }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#e94560' } } }} />
        {error && <Typography sx={{ color: '#e94560', mt: 1 }}>{error}</Typography>}
        <Button type="submit" fullWidth variant="contained" disabled={loading}
          sx={{ mt: 3, py: 1.5, background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold', fontSize: '1rem' }}>
          {loading ? 'Signing in...' : 'SIGN IN'}
        </Button>
        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 2 }}>
          Don't have an account? <Link to="/register" style={{ color: '#e94560' }}>Register</Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default Login
