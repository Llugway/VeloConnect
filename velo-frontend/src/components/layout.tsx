import { Box } from '@mui/material'
import { ReactNode } from 'react'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 10, md: 12 }, 
          pb: 8,
          px: { xs: 2, sm: 4, md: 6 },
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout