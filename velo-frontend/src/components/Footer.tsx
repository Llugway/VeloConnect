import { Box, Typography } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: 'grey.900',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} VeloConnect – Bordeaux
      </Typography>
      <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
        Mise en relation vélocistes et cyclistes – Tous droits réservés
      </Typography>
    </Box>
  )
}

export default Footer