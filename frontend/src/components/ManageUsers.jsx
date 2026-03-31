import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'

const ManageUsers = () => {
  const { adminToken } = useAuth()
  const [users, setUsers] = useState([])
  const [pending, setPending] = useState([])
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const h = { token: adminToken }
    axios.get('http://localhost:5000/admin/all-users', { headers: h }).then(r => setUsers(r.data))
    axios.get('http://localhost:5000/admin/pending-users', { headers: h }).then(r => setPending(r.data))
  }, [adminToken])

  const approveUser = async (id) => {
    await axios.put(`http://localhost:5000/admin/approve-user/${id}`, {}, { headers: { token: adminToken } })
    setPending(pending.filter(u => u._id !== id))
    setUsers(prev => prev.map(u => u._id === id ? { ...u, isApproved: true } : u))
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    await axios.delete(`http://localhost:5000/admin/delete-user/${id}`, { headers: { token: adminToken } })
    setUsers(users.filter(u => u._id !== id))
    setPending(pending.filter(u => u._id !== id))
  }

  const cellStyle = { color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }
  const headStyle = { color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0d0d1a', px: { xs: 2, md: 6 }, py: 4, color: '#fff' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>User Management</Typography>
      {pending.length > 0 && (
        <Box sx={{ background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography sx={{ color: '#e94560', fontWeight: 'bold' }}>⚠ {pending.length} user(s) awaiting approval</Typography>
        </Box>
      )}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)' }, '& .Mui-selected': { color: '#e94560' }, '& .MuiTabs-indicator': { background: '#e94560' } }}>
        <Tab label={`All Users (${users.length})`} />
        <Tab label={`Pending Approval (${pending.length})`} />
      </Tabs>

      <Box sx={{ background: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Username', 'Email', 'Status', 'Joined', 'Actions'].map(h => (
                <TableCell key={h} sx={headStyle}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(tab === 0 ? users : pending).map(u => (
              <TableRow key={u._id}>
                <TableCell sx={{ ...cellStyle, color: '#fff', fontWeight: 'bold' }}>{u.username}</TableCell>
                <TableCell sx={cellStyle}>{u.email}</TableCell>
                <TableCell sx={cellStyle}>
                  <Chip label={u.isApproved ? 'Approved' : 'Pending'} size="small"
                    sx={{ background: u.isApproved ? '#4caf50' : '#ff9800', color: '#fff' }} />
                </TableCell>
                <TableCell sx={cellStyle}>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                <TableCell sx={cellStyle}>
                  {!u.isApproved && (
                    <Button size="small" startIcon={<CheckCircleIcon />}
                      sx={{ color: '#4caf50', mr: 1 }} onClick={() => approveUser(u._id)}>Approve</Button>
                  )}
                  <Button size="small" startIcon={<DeleteIcon />}
                    sx={{ color: '#e94560' }} onClick={() => deleteUser(u._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

export default ManageUsers