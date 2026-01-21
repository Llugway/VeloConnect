import { useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material'
import PedalBikeIcon from '@mui/icons-material/PedalBike'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)!
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="fixed" elevation={0} sx={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,102,204,0.95)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, height: 72 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PedalBikeIcon sx={{ fontSize: 36, color: 'white' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.5px',
              textDecoration: 'none',
              color: 'white',
            }}
          >
            VeloConnect
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button color="inherit" component={RouterLink} to="/pros" sx={{ fontWeight: 500 }}>
            Professionnels
          </Button>

          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard" sx={{ fontWeight: 500 }}>
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/mes-rdv" sx={{ fontWeight: 500 }}>
                Mes RDV
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                sx={{ borderColor: 'white', fontWeight: 500 }}
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login" sx={{ fontWeight: 500 }}>
                Connexion
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                sx={{
                  backgroundColor: '#0066cc !important', 
                  color: '#ffffff !important',            
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 3,
                  boxShadow: '0 4px 14px rgba(0,102,204,0.3) !important',
                  '&:hover': {
                    backgroundColor: '#004080 !important',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(0,102,204,0.4) !important',
                  },
                }}
              >
                Inscription
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar