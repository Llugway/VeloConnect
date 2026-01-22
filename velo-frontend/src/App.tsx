import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext, AuthProvider } from './context/AuthContext'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import ListPros from './pages/ListPros'
import Navbar from './components/Navbar'
import CreatePro from './pages/CreatePro'
import ProDetails from './pages/Prodetails'
import AddDispo from './pages/AddDispo'
import MesRDV from './pages/MesRDV'
import Layout from './components/Layout'



function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useContext(AuthContext)!
  return isAuthenticated ? children : <Navigate to="/login" replace />
}


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  )
}

function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext)!

  return (
   <Layout> 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/pros" element={<ListPros />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/pros/:id" element={<ProDetails />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-pro"
        element={
          <ProtectedRoute>
            <CreatePro />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-dispo"
        element={
        <ProtectedRoute>
          <AddDispo />
        </ProtectedRoute>
        }
      />
      <Route
        path="/mes-rdv"
        element={
          <ProtectedRoute>
            <MesRDV />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
  )
}

export default App