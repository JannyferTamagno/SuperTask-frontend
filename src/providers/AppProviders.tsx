'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/hooks/useAuth'
import { ThemeProvider } from './ThemeProvider'

interface AppProvidersProps {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
