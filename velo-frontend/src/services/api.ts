import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

let loadingToast: string | null = null

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  if (!loadingToast) {
    loadingToast = toast.loading('Chargement...')
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    if (loadingToast) {
      toast.dismiss(loadingToast)
      loadingToast = null
    }
    return response
  },
  (error) => {
    if (loadingToast) {
      toast.dismiss(loadingToast)
      loadingToast = null
    }

    const msg = error.response?.data?.error || error.message || 'Erreur serveur'
    toast.error(msg)
    return Promise.reject(error)
  }
)

export default api