'use client'

import { useState, useEffect, useCallback } from 'react'
import { dashboardAPI, DashboardStats, Quote } from '@/api'

interface UseDashboard {
  stats: DashboardStats | null
  quote: Quote | null
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
  refreshQuote: () => Promise<void>
}

export function useDashboard(): UseDashboard {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshStats = useCallback(async () => {
    try {
      setError(null)
      const statsData = await dashboardAPI.getStats()
      setStats(statsData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao buscar estatísticas')
      console.error('Failed to fetch dashboard stats:', error)
    }
  }, [])

  const refreshQuote = useCallback(async () => {
    try {
      setError(null)
      const quoteData = await dashboardAPI.getQuote()
      setQuote(quoteData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao buscar frase do dia')
      console.error('Failed to fetch daily quote:', error)
    }
  }, [])

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      
      try {
        await Promise.all([
          refreshStats(),
          refreshQuote()
        ])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [refreshStats, refreshQuote])

  return {
    stats,
    quote,
    loading,
    error,
    refreshStats,
    refreshQuote
  }
}
