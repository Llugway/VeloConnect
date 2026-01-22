import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Chip, Button, Grid, CardActions } from '@mui/material'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Pro } from '../types/pro';


interface Dispo {
  id: number
  date: string
  heure: string
  disponible: boolean
}

const ProDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [pro, setPro] = useState<Pro | null>(null)

  const [pros, setPros] = useState<Pro[]>([]);
  const [dispos, setDispos] = useState<Dispo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [bookingLoading, setBookingLoading] = useState<number | null>(null)

  useEffect(() => {
    const fetchProAndDispos = async () => {
      try {
        // Récupère les infos du pro
        const proRes = await api.get(`/pros/${id}`)
        setPro(proRes.data)

        // Récupère ses dispos
        const disposRes = await api.get(`/pros/${id}/dispos`)
        setDispos(disposRes.data)
      } catch (err: any) {
        setError('Impossible de charger les informations')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProAndDispos()
  }, [id])

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />

  if (error || !pro) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || 'Professionnel non trouvé'}</Alert>
        <Button variant="contained" onClick={() => navigate('/pros')} sx={{ mt: 3 }}>
          Retour à la liste
        </Button>
      </Box>
    )
  }

  const handleBook = (dispoId: number) => {
  toast((t) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
      <Typography variant="subtitle1">
        Confirmer la réservation ?
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button size="small" variant="outlined" onClick={() => toast.dismiss(t.id)}>
          Annuler
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          onClick={() => {
            toast.dismiss(t.id)
            confirmBook(dispoId)
          }}
        >
          Réserver
        </Button>
      </Box>
    </Box>
  ), { duration: Infinity })
}

const confirmBook = async (dispoId: number) => {
  toast.promise(
    api.post('/rdv', { dispo_id: dispoId }),
    {
      loading: 'Réservation en cours...',
      success: (res) => {
        window.location.reload()
        return 'RDV réservé ! ' + res.data.message
      },
      error: (err) => err.response?.data?.error || 'Réservation échouée'
    }
  )
}

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        {pro.nom}
      </Typography>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Adresse
          </Typography>
          <Typography color="text.secondary" paragraph>
            {pro.adresse}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Types de réparation
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {pro.types_reparation.map((type : string, idx : number) => (
              <Chip key={idx} label={type} color="primary" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Disponibilités
      </Typography>

      {dispos.length === 0 ? (
        <Typography>Aucune disponibilité pour le moment.</Typography>
      ) : (
        <Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2, 1fr)',
      md: 'repeat(3, 1fr)',
    },
    gap: 3,
    mt: 4,
  }}
>
  {dispos.map((d) => (
    <Card key={d.id} variant="outlined">
      <CardContent>
        <Typography variant="subtitle1">
          {new Date(d.date).toLocaleDateString('fr-FR')}
        </Typography>
        <Typography variant="body1" color="primary">
          {d.heure}
        </Typography>
        <Chip
          label={d.disponible ? 'Disponible' : 'Réservé'}
          color={d.disponible ? 'success' : 'error'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>

      {d.disponible && (
        <CardActions>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleBook(d.id)}
            disabled={bookingLoading === d.id}
          >
            {bookingLoading === d.id ? 'Réservation...' : 'Réserver ce créneau'}
          </Button>
        </CardActions>
        )}
        </Card>
      ))}
    </Box>
      )}

      <Button variant="outlined" onClick={() => navigate('/pros')} sx={{ mt: 4 }}>
        Retour à la liste
      </Button>
    </Box>
  )
}

export default ProDetails