import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import api from '../services/api'

const ListePros = () => {
  const [pros, setPros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/pros')
      .then(res => {
        setPros(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Impossible de charger les professionnels')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 4 }}>
          Chargement des professionnels...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom align="center">
        Nos vélocistes à Bordeaux et alentours
      </Typography>

      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Trouvez le professionnel qui correspond à vos besoins – réparation, entretien, conseil.
      </Typography>

      <Grid container spacing={4}>
        {pros.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ textAlign: 'center' }}>
              Aucun professionnel disponible pour le moment. Revenez vite !
            </Alert>
          </Grid>
        ) : (
          pros.map((pro) => (
            <Grid item xs={12} sm={6} md={4} key={pro.id}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  },
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/pros/${pro.id}`)}
              >
                <Box sx={{ height: 220, overflow: 'hidden' }}>
                  <img
                    src={pro.image || 'https://images.pexels.com/photos/2598290/pexels-photo-2598290.jpeg'}
                    alt={pro.nom}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {pro.nom}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {pro.adresse}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {pro.types_reparation?.map((type, idx) => (
                      <Chip key={idx} label={type} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                  >
                    Voir disponibilités →
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  )
}

export default ListePros