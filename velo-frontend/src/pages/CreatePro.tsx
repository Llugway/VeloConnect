import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Box, Typography, TextField, Button, Alert, Chip, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material'
import api from '../services/api'

const CreatePro = () => {
  const { user } = useContext(AuthContext)!
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [types, setTypes] = useState<string[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const commonTypes = ['Freins', 'Pneus', 'Changement de chaîne', 'Réglage dérailleurs', 'Cadre', 'Éclairage', 'Autres']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nom || !adresse) {
      setError('Nom et adresse obligatoires')
      return
    }

    try {
      await api.post('/pros', {
        nom,
        adresse,
        types_reparation: types
      })
      setSuccess('Profil pro créé avec succès !')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Échec création profil')
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Créer mon profil professionnel
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom du pro / atelier"
          fullWidth
          margin="normal"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <TextField
          label="Adresse"
          fullWidth
          margin="normal"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Types de réparation</InputLabel>
          <Select
            multiple
            value={types}
            onChange={(e) => setTypes(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
            input={<OutlinedInput label="Types de réparation" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {commonTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Créer le profil
        </Button>
      </form>
    </Box>
  )
}

export default CreatePro