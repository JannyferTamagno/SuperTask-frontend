'use client'

import { useState, useEffect, useCallback } from 'react'
import { tasksAPI, categoriesAPI, Task, Category, formatToAPI, formatFromAPI } from '@/api'

interface TaskFilters {
  search: string
  priority: string
  status: string
  category?: number
}

interface UseTasks {
  tasks: any[]
  categories: Category[]
  loading: boolean
  error: string | null
  
  createTask: (taskData: any) => Promise<void>
  updateTask: (id: string, taskData: any) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskStatus: (id: string) => Promise<void>
  
  createCategory: (categoryData: { name: string; color?: string }) => Promise<void>
  
  fetchTasks: (filters?: TaskFilters) => Promise<void>
  fetchCategories: () => Promise<void>
  
  stats: {
    total: number
    completed: number
    pending: number
    overdue: number
    highPriority: number
    dueToday: number
  }
}

export function useTasks(): UseTasks {
  const [tasks, setTasks] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      setLoading(true)
      setError(null)

      const apiParams: any = {}
      
      if (filters?.priority) {
        apiParams.priority = formatToAPI.priority(filters.priority as any)
      }
      
      if (filters?.status) {
        apiParams.status = formatToAPI.status(filters.status as any)
      }
      
      if (filters?.category) {
        apiParams.category = filters.category
      }

      const response = await tasksAPI.list(apiParams)
      
      const formattedTasks = response.results.map(formatFromAPI.task)
      
      let filteredTasks = formattedTasks
      if (filters?.search) {
        filteredTasks = formattedTasks.filter(task =>
          task.title.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      
      setTasks(filteredTasks)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao buscar tarefas')
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.list()
      setCategories(response.results)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  const createTask = async (taskData: any) => {
    try {
      setError(null)
      
      let categoryId = null
      if (taskData.category?.name && taskData.category.name !== 'Sem categoria') {
        const category = categories.find(cat => cat.name === taskData.category.name)
        categoryId = category?.id || null
      }

      const apiTaskData = {
        title: taskData.title,
        description: taskData.description || undefined,
        priority: formatToAPI.priority(taskData.priority),
        due_date: taskData.dueDate || undefined,
        category: categoryId || undefined
      }

      const newTask = await tasksAPI.create(apiTaskData)
      
      const formattedTask = formatFromAPI.task(newTask)
      setTasks(prev => [formattedTask, ...prev])
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar tarefa')
      throw error
    }
  }

  const updateTask = async (id: string, taskData: any) => {
    try {
      setError(null)
      
      let categoryId = null
      if (taskData.category?.name && taskData.category.name !== 'Sem categoria') {
        const category = categories.find(cat => cat.name === taskData.category.name)
        categoryId = category?.id || null
      }

      const apiTaskData = {
        title: taskData.title,
        description: taskData.description || undefined,
        priority: formatToAPI.priority(taskData.priority),
        status: formatToAPI.status(taskData.status),
        due_date: taskData.dueDate || undefined,
        category: categoryId || undefined
      }

      const updatedTask = await tasksAPI.update(parseInt(id), apiTaskData)
      
      const formattedTask = formatFromAPI.task(updatedTask)
      setTasks(prev => prev.map(task => 
        task.id === id ? formattedTask : task
      ))
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao atualizar tarefa')
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      setError(null)
      await tasksAPI.delete(parseInt(id))
      
      setTasks(prev => prev.filter(task => task.id !== id))
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao deletar tarefa')
      throw error
    }
  }

  const toggleTaskStatus = async (id: string) => {
    try {
      setError(null)
      const updatedTask = await tasksAPI.toggleStatus(parseInt(id))
      
      const formattedTask = formatFromAPI.task(updatedTask)
      setTasks(prev => prev.map(task => 
        task.id === id ? formattedTask : task
      ))
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao alterar status da tarefa')
      throw error
    }
  }

  const createCategory = async (categoryData: { name: string; color?: string }) => {
    try {
      setError(null)
      const newCategory = await categoriesAPI.create(categoryData)
      setCategories(prev => [...prev, newCategory])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar categoria')
      throw error
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'Completed').length,
    pending: tasks.filter(task => task.status === 'Pending').length,
    overdue: tasks.filter(task => {
      const today = new Date().toISOString().split('T')[0]
      return task.status === 'Pending' && task.dueDate && task.dueDate < today
    }).length,
    highPriority: tasks.filter(task => 
      task.priority === 'High' && task.status === 'Pending'
    ).length,
    dueToday: tasks.filter(task => {
      const today = new Date().toISOString().split('T')[0]
      return task.dueDate === today && task.status === 'Pending'
    }).length
  }

  useEffect(() => {
    fetchCategories()
    fetchTasks()
  }, [fetchTasks, fetchCategories])

  return {
    tasks,
    categories,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    createCategory,
    fetchTasks,
    fetchCategories,
    stats
  }
}
