import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Box, Typography, Button } from '@mui/material'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)!

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      {user ? (
        <>
          <Typography variant="h6">
            Bienvenue, {user.email} ({user.role})
          </Typography>
          <Button variant="outlined" color="error" onClick={logout} sx={{ mt: 3 }}>
            Se déconnecter
          </Button>
        </>
      ) : (
        <Typography>Non connecté (devrait être protégé)</Typography>
      )}
    </Box>
  )
}

export default Dashboard