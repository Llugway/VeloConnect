import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'

interface AuthContextType {
  user: any | null
  token: string | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken)
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken)
          setUser(decoded)
        } else {
          localStorage.removeItem('access_token')
        }
      } catch (err) {
        localStorage.removeItem('access_token')
      }
    }
  }, [])

  const login = (newToken: string) => {
    localStorage.setItem('access_token', newToken)
    const decoded: any = jwtDecode(newToken)
    setToken(newToken)
    setUser(decoded)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}