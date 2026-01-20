import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress, Alert } from '@mui/material'
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
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                onClick={() => navigate(`/pros/${pro.id}`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {pro.nom}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {pro.adresse}
                  </Typography>
                  <Typography variant="body2">
                    Réparations : {pro.types_reparation.join(', ') || 'Non précisé'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Voir disponibilités
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