import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

const BookingForm = ({ hotel, onClose }) => {
  const { token, username } = useAuth()
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1 })
  const [bookingId, setBookingId] = useState(null)
  const [total, setTotal] = useState(0)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const calcTotal = () => {
    if (!form.checkIn || !form.checkOut) return 0
    const nights = Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights * hotel.pricePerNight * Number(form.guests) : 0
  }

  const handleCreateBooking = async () => {
    if (!form.checkIn || !form.checkOut) return setError('Please select check-in and check-out dates')
    if (new Date(form.checkOut) <= new Date(form.checkIn)) return setError('Check-out must be after check-in')
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(
        'http://localhost:5000/bookings/create',
        { hotelId: hotel._id, ...form, guests: Number(form.guests) },
        { headers: { token } }
      )
      setBookingId(res.data.newBooking._id)
      setTotal(res.data.newBooking.totalAmount)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating booking')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      const orderRes = await axios.post(
        'http://localhost:5000/payment/create-order',
        { bookingId },
        { headers: { token } }
      )
      const { orderId, amount, currency, keyId } = orderRes.data

      if (!window.Razorpay) {
        setError('Razorpay SDK not loaded. Please refresh the page.')
        setLoading(false)
        return
      }

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'LuxeStay Hotels',
        description: `Booking at ${hotel.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await axios.post(
              'http://localhost:5000/payment/verify',
              {
                bookingId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { token } }
            )
            setStep(3)
          } catch {
            setError('Payment verification failed. Contact support.')
          }
        },
        prefill: {
          name: username || 'Guest',
          email: '',
        },
        theme: { color: '#e94560' },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment was cancelled.')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.')
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 3) return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold', mb: 1 }}>✓ Booking Confirmed!</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>Your stay at {hotel.name} is confirmed.</Typography>
      <Button variant="outlined" sx={{ color: '#e94560', borderColor: '#e94560' }} onClick={onClose}>Close</Button>
    </Box>
  )

  return (
    <Box>
      {step === 1 && (
        <>
          <TextField
            label="Check In" type="date" value={form.checkIn}
            onChange={e => setForm({ ...form, checkIn: e.target.value })}
            inputProps={{ min: today }}
            fullWidth InputLabelProps={{ shrink: true, style: { color: 'rgba(255,255,255,0.6)' } }}
            InputProps={{ style: { color: '#fff' } }} margin="dense"
            sx={{ '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
          />
          <TextField
            label="Check Out" type="date" value={form.checkOut}
            onChange={e => setForm({ ...form, checkOut: e.target.value })}
            inputProps={{ min: form.checkIn || today }}
            fullWidth InputLabelProps={{ shrink: true, style: { color: 'rgba(255,255,255,0.6)' } }}
            InputProps={{ style: { color: '#fff' } }} margin="dense"
            sx={{ '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
          />
          <TextField
            label="Guests" type="number" value={form.guests} inputProps={{ min: 1, max: 10 }}
            onChange={e => setForm({ ...form, guests: e.target.value })}
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
            InputProps={{ style: { color: '#fff' } }} margin="dense"
            sx={{ '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }}
          />
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
          <Typography sx={{ color: '#fff', mb: 2 }}>
            Estimated Total: <strong style={{ color: '#e94560' }}>₹{calcTotal().toLocaleString()}</strong>
          </Typography>
          {error && <Typography sx={{ color: '#e94560', mb: 1, fontSize: '0.85rem' }}>{error}</Typography>}
          <Button
            fullWidth variant="contained"
            disabled={loading || !form.checkIn || !form.checkOut}
            sx={{ background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold' }}
            onClick={handleCreateBooking}
          >
            {loading ? 'Creating...' : 'Confirm Booking'}
          </Button>
        </>
      )}
      {step === 2 && (
        <>
          <Typography sx={{ color: '#fff', mb: 1 }}>
            Total Amount: <strong style={{ color: '#e94560' }}>₹{total.toLocaleString()}</strong>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, fontSize: '0.9rem' }}>
            Click below to proceed to payment via Razorpay
          </Typography>
          {error && <Typography sx={{ color: '#e94560', mb: 1 }}>{error}</Typography>}
          <Button
            fullWidth variant="contained" disabled={loading}
            sx={{ background: 'linear-gradient(135deg, #e94560, #c62a47)', fontWeight: 'bold', mb: 1 }}
            onClick={handlePayment}
          >
            {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
          </Button>
          <Button fullWidth variant="text" sx={{ color: 'rgba(255,255,255,0.5)' }} onClick={() => setStep(1)}>← Back</Button>
        </>
      )}
    </Box>
  )
}

export default BookingForm
