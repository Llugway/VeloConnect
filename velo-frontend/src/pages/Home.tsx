import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip, Container, Rating } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import BuildIcon from '@mui/icons-material/Build'
import ScheduleIcon from '@mui/icons-material/Schedule'
import StarIcon from '@mui/icons-material/Star'
import { useState, useEffect } from 'react'
import api from '../services/api'
import LocationOnIcon from '@mui/icons-material/LocationOn';

const featuredPros = [
  {
    id: 1,
    nom: "Vélo Atelier Bordeaux",
    adresse: "12 Rue Sainte-Catherine, 33000 Bordeaux",
    types: ["freins", "pneus", "chaîne", "électrique"],
    rating: 4.8,
    avisCount: 42,
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c",
  },
  {
    id: 2,
    nom: "Cycle Sport Mérignac",
    adresse: "Avenue de l'Argonne, 33700 Mérignac",
    types: ["vtt", "route", "gravel", "cadre carbone"],
    rating: 4.9,
    avisCount: 31,
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c",
  },
  {
    id: 3,
    nom: "Répar Vélo 33",
    adresse: "Rue des Faures, 33400 Talence",
    types: ["freins", "éclairage", "voyage", "urbain"],
    rating: 4.7,
    avisCount: 28,
    image: "https://images.unsplash.com/photo-1486218119243-13883505764c",
  },
]

const Home = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          height: { xs: '70vh', md: '85vh' },
          backgroundImage: 'url("https://images.unsplash.com/photo-1504280390367-361c6d9f0f5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80")',
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
            background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.8rem', md: '4.8rem' },
              fontWeight: 800,
              mb: 3,
              letterSpacing: '-1px',
            }}
          >
            Votre vélo réparé rapidement<br />et près de chez vous
          </Typography>

          <Typography variant="h5" sx={{ mb: 6, maxWidth: 800, mx: 'auto', opacity: 0.95 }}>
            Des vélocistes indépendants, passionnés, disponibles quand vous l’êtes.
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
                fontSize: '1.3rem',
                py: 2,
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
                fontSize: '1.3rem',
                py: 2,
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
          {featuredPros.map((pro) => (
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
                    src={pro.image}
                    alt={pro.nom}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                    <Rating value={pro.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      {pro.rating} ({pro.avisCount} avis)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {pro.types.map((type, idx) => (
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
          ))}
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