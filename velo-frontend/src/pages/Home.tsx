import { useState, useEffect } from 'react'
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip, Container, Rating } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import api from '../services/api'
import { Pro } from '../types/pro';

const Home = () => {
  const [pros, setPros] = useState<Pro[]>([]);

  useEffect(() => {
    api.get('/pros?limit=4')
      .then(res => setPros(res.data))
      .catch(err => console.error('Erreur chargement pros:', err))
  }, [])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          height: { xs: '70vh', md: '85vh' },
          backgroundImage: 'url("https://images.unsplash.com/photo-1558981403-c5f9899a28b1")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.45))',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', md: '5rem' },
              fontWeight: 800,
              mb: 3,
              letterSpacing: '-1.5px',
            }}
          >
            Réparez votre vélo<br />sans perdre de temps
          </Typography>

          <Typography variant="h5" sx={{ mb: 6, maxWidth: 900, mx: 'auto', opacity: 0.95 }}>
            Des vélocistes indépendants près de chez vous, disponibles quand vous l’êtes.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to="/pros"
              sx={{
                backgroundColor: '#0066cc !important', 
                color: '#ffffff !important',
                fontSize: '1.4rem',
                py: 2.5,
                px: 8,
                boxShadow: 8,
                '&:hover': { backgroundColor: 'grey.100' },
              }}
            >
              Trouver un pro près de moi
            </Button>

            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/register"
              sx={{
                color: 'white',
                borderColor: 'white',
                fontSize: '1.4rem',
                py: 2.5,
                px: 8,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
              }}
            >
              Devenir vélociste
            </Button>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
          Vélocistes recommandés à Bordeaux
        </Typography>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          {pros.length > 0 ? (
            pros.slice(0, 4).map((pro) => (
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
                  }}
                >
                  <Box sx={{ height: 220, overflow: 'hidden' }}>
                    <img
                      src={pro.image || 'https://images.unsplash.com/photo-1486218119243-13883505764c'}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={pro.rating || 4.5} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        {pro.rating || 4.5} ({pro.avisCount || Math.floor(Math.random() * 30 + 20)} avis)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {pro.types_reparation?.map((type, idx) => (
                        <Chip key={idx} label={type} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={RouterLink}
                      to={`/pros/${pro.id}`}
                    >
                      Voir disponibilités →
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography align="center" color="text.secondary" sx={{ width: '100%' }}>
              Aucun professionnel disponible pour le moment
            </Typography>
          )}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 14, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Prêt à faire réparer votre vélo ?
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.9 }}>
            Trouvez un professionnel qualifié près de chez vous en quelques clics.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/pros"
            sx={{
              backgroundColor: '#0066cc !important', 
              color: '#ffffff !important',
              fontSize: '1.4rem',
              py: 2.5,
              px: 10,
              boxShadow: 8,
              '&:hover': { backgroundColor: 'grey.100' },
            }}
          >
            Trouver un pro près de moi
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
