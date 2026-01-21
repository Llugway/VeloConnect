import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import api from '../services/api'


const AddDispo = () => {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()

  const [date, setDate] = useState('')
  const [heure, setHeure] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!date || !heure) {
      setError('Date et heure obligatoires')
      setLoading(false)
      return
    }

    // Validation format date YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError('Format de date invalide (YYYY-MM-DD)')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/dispos', {
        date,
        heure,
      })
      setSuccess('Disponibilité ajoutée avec succès !')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Erreur lors de l’ajout')
    } finally {
      setLoading(false)
    }
  }

  return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Ajouter une disponibilité
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Date (YYYY-MM-DD)"
            fullWidth
            margin="normal"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            placeholder="2026-01-25"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="heure-label">Heure</InputLabel>
            <Select
              labelId="heure-label"
              value={heure}
              label="Heure"
              onChange={(e) => setHeure(e.target.value)}
              required
            >
              {Array.from({ length: 24 }, (_, i) => {
                const h = i.toString().padStart(2, '0')
                return <MenuItem key={h} value={`${h}:00`}>{`${h}:00`}</MenuItem>
              })}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter la disponibilité'}
          </Button>
        </form>
      </Box>
  )
}

export default AddDispo