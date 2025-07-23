'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { authAPI, User } from '@/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: UpdateProfileData) => Promise<void>
  isAuthenticated: boolean
  error: string | null
}

interface RegisterData {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name?: string
  last_name?: string
}

interface UpdateProfileData {
  first_name?: string
  last_name?: string
  email?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const userData = await authAPI.getUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        
        try {
          await authAPI.logout()
        } catch (logoutError) {
          console.error('Logout error during init:', logoutError)
        }
        
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.login({ username, password })
      setUser(response.user)
      
      console.log('✅ Login realizado com sucesso!')
      
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro no login'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.register(userData)
      setUser(response.user)
      
      console.log('✅ Registro realizado com sucesso!')
      
    } catch (error) {
      console.error('Register error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro no registro'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      
      await authAPI.logout()
      
      console.log('✅ Logout realizado com sucesso!')
      
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setLoading(false)
    }
  }

  const updateProfile = async (userData: UpdateProfileData) => {
    try {
      setError(null)
      
      const updatedUser = await authAPI.updateProfile(userData)
      setUser(updatedUser)
      
      console.log('✅ Perfil atualizado com sucesso!')
      
    } catch (error) {
      console.error('Update profile error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: user !== null,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
