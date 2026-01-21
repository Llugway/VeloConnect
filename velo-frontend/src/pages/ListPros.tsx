import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, Alert, Chip } from '@mui/material'
import api from '../services/api'


interface Pro {
  id: number
  nom: string
  adresse: string
  types_reparation: string[]
}

const ListePros = () => {
  const [pros, setPros] = useState<Pro[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPros = async () => {
      try {
        const response = await api.get('/pros')
        setPros(response.data)
      } catch (err: any) {
        setError('Impossible de charger les professionnels')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPros()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  return (
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Liste des professionnels
        </Typography>

        {pros.length === 0 ? (
          <Typography>Aucun professionnel trouvé pour le moment.</Typography>
        ) : (
          <Grid container spacing={3}>
            {pros.map((pro) => (
              <Grid item xs={12} sm={6} md={4} key={pro.id}>
                <Card
                  elevation={3}
                  sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
                  },
                }}
                onClick={() => navigate(`/pros/${pro.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {pro.nom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {pro.adresse}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Réparations :
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {pro.types_reparation.map((type, idx) => (
                        <Chip key={idx} label={type} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button size="small" color="primary">
                      Voir disponibilités →
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
  )
}

export default ListePros