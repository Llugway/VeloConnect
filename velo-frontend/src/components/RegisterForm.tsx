import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography, Alert } from '@mui/material'
import api from '../services/api'

const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ville, setVille] = useState('')
  const [role, setRole] = useState<'user' | 'pro'>('user')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/register', { email, password, ville, role })
      navigate('/login')  // redirige vers login après inscription
    } catch (err: any) {
      setError(err.response?.data?.error || 'Inscription échouée')
    }
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Inscription
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Mot de passe"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Ville"
          fullWidth
          margin="normal"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant={role === 'user' ? 'contained' : 'outlined'}
            onClick={() => setRole('user')}
          >
            Utilisateur
          </Button>
          <Button
            variant={role === 'pro' ? 'contained' : 'outlined'}
            onClick={() => setRole('pro')}
            sx={{ ml: 2 }}
          >
            Professionnel
          </Button>
        </Box>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          S'inscrire
        </Button>
      </form>
    </Box>
  )
}

export default RegisterForm