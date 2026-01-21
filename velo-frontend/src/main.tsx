import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <ThemeProvider theme={theme}>    
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster 
        position="top-right"
        richColors
        toastOptions={{
        duration: 5000,
        style: {
          borderRadius: '12px',
          padding: '16px',
          fontSize: '16px',
          maxWidth: '400px',
        },
      }}
      />
    </ThemeProvider>
  </React.StrictMode>
)