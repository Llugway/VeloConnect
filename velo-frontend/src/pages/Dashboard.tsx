import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)!
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      {user ? (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bienvenue, {user.email}
            </Typography>
            
            <Typography color="text.secondary" gutterBottom>
              Rôle : {user.role === 'pro' ? 'Professionnel' : 'Utilisateur'}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Ville : {user.ville || 'Non renseignée'}
            </Typography>

            {user.role === 'pro' && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/add-dispo"
                >
                  Ajouter une disponibilité
                </Button>
              </Box>
            )}
            
            {user.role === 'pro' && (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/create-pro"
                sx={{ mt: 3 }}
              >
                Créer / Modifier mon profil pro
              </Button>
            )}

            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{ mt: 3 }}
            >
              Se déconnecter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography>Erreur : utilisateur non chargé</Typography>
      )}
    </Box>
  )
}

export default Dashboard