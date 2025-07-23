'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface AuthguardProps {
  children: ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function Authguard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthguardProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, loading, requireAuth, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export function useAuthguard(requireAuth: boolean = true) {
  const { isAuthenticated, loading } = useAuth()
  
  return {
    isAuthenticated,
    loading,
    shouldShowContent: loading ? false : requireAuth ? isAuthenticated : true
  }
}
