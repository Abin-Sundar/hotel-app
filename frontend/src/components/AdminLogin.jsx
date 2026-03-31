import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { loginAdmin } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/admin/login', form)
      loginAdmin(res.data.admintoken)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d0d1a, #1a1a3e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box component="form" onSubmit={handleLogin} sx={{ width: 420, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.3)', p: 4, borderRadius: 3, textAlign: 'center' }}>
        <AdminPanelSettingsIcon sx={{ fontSize: 60, color: '#e94560', mb: 1 }} />
        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>Admin Portal</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>Restricted access — Authorized personnel only</Typography>
        {['username', 'password'].map((field) => (
          <TextField key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} name={field}
            type={field === 'password' ? 'password' : 'text'} value={form[field]} onChange={handleChange}
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
            InputProps={{ style: { color: '#fff' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(233,69,96,0.3)' }, '&:hover fieldset': { borderColor: '#e94560' } } }} />
        ))}
        {error && <Typography sx={{ color: '#e94560', mt: 1 }}>{error}</Typography>}
        <Button type="submit" fullWidth variant="contained"
          sx={{ mt: 3, py: 1.5, background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold', fontSize: '1rem' }}>
          ACCESS ADMIN PANEL
        </Button>
      </Box>
    </Box>
  )
}

export default AdminLogin