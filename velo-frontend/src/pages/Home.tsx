import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'

const Home = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 10, px: 2 }}>
      <Typography variant="h3" gutterBottom>
        Bienvenue sur VeloConnect
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mb: 5 }}>
        Mise en relation entre vélocistes réparateurs et utilisateurs
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={Link} 
          to="/login"
        >
          Se connecter
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large" 
          component={Link} 
          to="/register"
        >
          S'inscrire
        </Button>
      </Box>
    </Box>
  )
}

export default Home