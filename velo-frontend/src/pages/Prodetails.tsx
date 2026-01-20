import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Chip, Divider, Button, Grid } from '@mui/material'
import api from '../services/api'

interface Pro {
  id: number
  nom: string
  adresse: string
  types_reparation: string[]
}

interface Dispo {
  id: number
  date: string
  heure: string
  disponible: boolean
}

const ProDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [pro, setPro] = useState<Pro | null>(null)
  const [dispos, setDispos] = useState<Dispo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProAndDispos = async () => {
      try {
        // Récupère les infos du pro
        const proRes = await api.get(`/pros/${id}`)
        setPro(proRes.data)

        // Récupère ses dispos
        const disposRes = await api.get(`/pros/${id}/dispos`)
        setDispos(disposRes.data)
      } catch (err: any) {
        setError('Impossible de charger les informations')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProAndDispos()
  }, [id])

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />

  if (error || !pro) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || 'Professionnel non trouvé'}</Alert>
        <Button variant="contained" onClick={() => navigate('/pros')} sx={{ mt: 3 }}>
          Retour à la liste
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {pro.nom}
      </Typography>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Adresse
          </Typography>
          <Typography color="text.secondary" paragraph>
            {pro.adresse}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Types de réparation
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {pro.types_reparation.map((type, idx) => (
              <Chip key={idx} label={type} color="primary" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Disponibilités
      </Typography>

      {dispos.length === 0 ? (
        <Typography>Aucune disponibilité pour le moment.</Typography>
      ) : (
        <Grid container spacing={2}>
          {dispos.map((d) => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1">
                    {new Date(d.date).toLocaleDateString('fr-FR')}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    {d.heure}
                  </Typography>
                  <Chip
                    label={d.disponible ? 'Disponible' : 'Réservé'}
                    color={d.disponible ? 'success' : 'error'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Button variant="outlined" onClick={() => navigate('/pros')} sx={{ mt: 4 }}>
        Retour à la liste
      </Button>
    </Box>
  )
}

export default ProDetails