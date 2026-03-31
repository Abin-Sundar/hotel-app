import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminPrivateRoutes = () => {
  const { adminToken } = useAuth()
  return adminToken ? <Outlet /> : <Navigate to="/admin/login" />
}

export default AdminPrivateRoutes