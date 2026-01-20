import { useContext } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)!
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}
        >
          VeloConnect
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={RouterLink} to="/">
            Accueil
          </Button>

          <Button color="inherit" component={RouterLink} to="/pros">
            Professionnels
          </Button>

          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard ({user?.role})
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Connexion
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
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