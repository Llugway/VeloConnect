import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api'
import toast from 'react-hot-toast'

interface Rdv {
  id: number
  pro_nom: string
  date: string
  heure: string
  status: string
}

const MesRDV = () => {
  const { isAuthenticated } = useContext(AuthContext)!
  const [rdvs, setRdvs] = useState<Rdv[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchMyRdv = async () => {
      try {
        const response = await api.get('/mes-rdv')
        setRdvs(response.data)
      } catch (err: any) {
        setError('Impossible de charger vos rendez-vous')
      } finally {
        setLoading(false)
      }
    }

    fetchMyRdv()
  }, [isAuthenticated])

  const handleCancel = (rdvId: number) => {
  toast((t) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
      <Typography variant="subtitle1">
        Confirmer l’annulation ?
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button size="small" variant="outlined" onClick={() => toast.dismiss(t.id)}>
          Non
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          color="error"
          onClick={() => {
            toast.dismiss(t.id)
            confirmCancel(rdvId)
          }}
        >
          Oui, annuler
        </Button>
      </Box>
    </Box>
  ), { duration: Infinity })
}

const confirmCancel = async (rdvId: number) => {
  toast.promise(
    api.delete(`/rdv/${rdvId}`),
    {
      loading: 'Annulation en cours...',
      success: () => {
        fetchRdvs()
        return 'RDV annulé avec succès'
      },
      error: (err) => err.response?.data?.error || 'Erreur lors de l’annulation'
    }
  )
}

  async function fetchRdvs() {
    setLoading(true);
    try {
        const response = await api.get('/mes-rdv');
        setRdvs(response.data);
    } catch (err: any) {
        setError('Impossible de charger les RDV');
    } finally {
        setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return <Alert severity="warning">Connectez-vous pour voir vos RDV</Alert>
  }

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />

  if (error) return <Alert severity="error">{error}</Alert>

  return (
        <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
            Mes rendez-vous
        </Typography>

        {rdvs.length === 0 ? (
            <Alert severity="info" sx={{ mt: 3 }}>
            Vous n'avez pas encore de rendez-vous.
            </Alert>
        ) : (
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Table>
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Professionnel</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Heure</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Statut</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rdvs.map((rdv) => (
                    <TableRow key={rdv.id} hover>
                    <TableCell>{rdv.pro_nom}</TableCell>
                    <TableCell>{new Date(rdv.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{rdv.heure}</TableCell>
                    <TableCell>
                        <Chip
                        label={rdv.status}
                        color={
                            rdv.status === 'confirmed' ? 'success' :
                            rdv.status === 'pending' ? 'warning' :
                            'error'
                        }
                        size="small"
                        />
                    </TableCell>
                    <TableCell>
                    {rdv.status !== 'cancelled' && (
                      <Tooltip title="Annuler le RDV">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleCancel(rdv.id)}
                        >
                        <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        )}
        </Box>
  )
}

export default MesRDV


