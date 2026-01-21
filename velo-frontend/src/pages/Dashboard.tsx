import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Box, Typography, Button, Card, CardContent, Divider } from '@mui/material'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)!

  return (
    <Box sx={{ p: { xs: 3, md: 6 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Bienvenue, {user?.email}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {user?.role === 'pro' ? 'Espace professionnel' : 'Espace utilisateur'}
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Vos informations
          </Typography>
          <Typography>Ville : {user?.ville || 'Non renseignée'}</Typography>

          {user?.role === 'pro' && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/add-dispo"
                fullWidth
              >
                Ajouter une disponibilité
              </Button>
            </Box>
          )}

          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/mes-rdv"
            sx={{ mt: 2 }}
          >
            Voir mes rendez-vous
          </Button>

          <Box sx={{ mt: 4 }}>
            <Button variant="outlined" color="error" onClick={logout} fullWidth>
              Se déconnecter
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard