const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supertask-api.onrender.com/api'

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile: {
    avatar: string | null
    bio: string
  }
}

export interface AuthResponse {
  user: User
  refresh: string
  access: string
  message: string
}

export interface Category {
  id: number
  name: string
  color: string
  task_count: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string | null
  category: number | null
  category_name: string | null
  is_overdue: boolean
  created_at: string
  updated_at: string
  completed_at: string | null
}

export interface DashboardStats {
  completed: number
  in_progress: number
  overdue: number
  high_priority: number
  due_today: number
  total_tasks: number
  categories_stats: Record<string, {
    total: number
    completed: number
    pending: number
  }>
}

export interface Quote {
  quote: string
  author: string
}

export interface ApiResponse<T> {
  count?: number
  next?: string | null
  previous?: string | null
  results?: T[]
  data?: T
}

class TokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token'
  private static REFRESH_TOKEN_KEY = 'refresh_token'

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    }
    return null
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
    return null
  }

  static setTokens(access: string, refresh: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, access)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh)
    }
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    }
  }
}

async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = TokenManager.getAccessToken()

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (response.status === 401 && token) {
      const newToken = await refreshAccessToken()
      if (newToken) {
        const retryConfig = {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          },
        }
        const retryResponse = await fetch(url, retryConfig)
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`)
        }
        
        return await retryResponse.json()
      } else {
        TokenManager.clearTokens()
        throw new Error('Session expired')
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${response.status}`)
    }

    if (response.status === 204) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    console.error('API Request failed:', error)
    throw error
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = TokenManager.getRefreshToken()
  
  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      TokenManager.setTokens(data.access, refreshToken)
      return data.access
    }
    
    return null
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}


export const authAPI = {
  register: async (userData: {
    username: string
    email: string
    password: string
    password_confirm: string
    first_name?: string
    last_name?: string
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    TokenManager.setTokens(response.access, response.refresh)
    return response
  },

  login: async (credentials: {
    username: string
    password: string
  }): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    TokenManager.setTokens(response.access, response.refresh)
    return response
  },

  logout: async (): Promise<{ message: string }> => {
    const refreshToken = TokenManager.getRefreshToken()
    
    const response = await apiRequest<{ message: string }>('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    })
    
    TokenManager.clearTokens()
    return response
  },

  getUser: (): Promise<User> => {
    return apiRequest<User>('/auth/user/')
  },

  getProfile: (): Promise<User> => {
    return apiRequest<User>('/auth/profile/')
  },

  updateProfile: (userData: {
    first_name?: string
    last_name?: string
    email?: string
  }): Promise<User> => {
    return apiRequest<User>('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  changePassword: (passwordData: {
    old_password: string
    new_password: string
    new_password_confirm: string
  }): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    })
  },

  isAuthenticated: (): boolean => {
    return TokenManager.getAccessToken() !== null
  }
}


export const categoriesAPI = {
  list: (params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<Category> & { results: Category[] }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    
    const queryString = searchParams.toString()
    return apiRequest<ApiResponse<Category> & { results: Category[] }>(
      `/categories/${queryString ? `?${queryString}` : ''}`
    )
  },

  create: (categoryData: {
    name: string
    color?: string
  }): Promise<Category> => {
    return apiRequest<Category>('/categories/', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  },

  get: (id: number): Promise<Category> => {
    return apiRequest<Category>(`/categories/${id}/`)
  },

  update: (id: number, categoryData: {
    name: string
    color?: string
  }): Promise<Category> => {
    return apiRequest<Category>(`/categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  },

  delete: (id: number): Promise<void> => {
    return apiRequest<void>(`/categories/${id}/`, {
      method: 'DELETE',
    })
  }
}


export const tasksAPI = {
  list: (params?: {
    priority?: 'low' | 'medium' | 'high'
    status?: 'pending' | 'in_progress' | 'completed'
    category?: number
    due_date?: 'today' | 'overdue'
    ordering?: 'due_date' | 'priority' | '-created_at'
    page?: number
  }): Promise<ApiResponse<Task> & { results: Task[] }> => {
    const searchParams = new URLSearchParams()
    
    if (params?.priority) searchParams.append('priority', params.priority)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.category) searchParams.append('category', params.category.toString())
    if (params?.due_date) searchParams.append('due_date', params.due_date)
    if (params?.ordering) searchParams.append('ordering', params.ordering)
    if (params?.page) searchParams.append('page', params.page.toString())
    
    const queryString = searchParams.toString()
    return apiRequest<ApiResponse<Task> & { results: Task[] }>(
      `/tasks/${queryString ? `?${queryString}` : ''}`
    )
  },

  create: (taskData: {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    status?: 'pending' | 'in_progress' | 'completed'
    due_date?: string
    category?: number
  }): Promise<Task> => {
    return apiRequest<Task>('/tasks/', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  },

  get: (id: number): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}/`)
  },

  update: (id: number, taskData: {
    title: string
    description?: string
    priority?: 'low' | 'medium' | 'high'
    status?: 'pending' | 'in_progress' | 'completed'
    due_date?: string
    category?: number
  }): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  },

  partialUpdate: (id: number, taskData: Partial<{
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    status: 'pending' | 'in_progress' | 'completed'
    due_date: string
    category: number
  }>): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(taskData),
    })
  },

  toggleStatus: (id: number): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}/toggle-status/`, {
      method: 'PATCH',
    })
  },

  delete: (id: number): Promise<void> => {
    return apiRequest<void>(`/tasks/${id}/`, {
      method: 'DELETE',
    })
  }
}


export const dashboardAPI = {
  getStats: (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>('/dashboard/stats/')
  },

  getQuote: (): Promise<Quote> => {
    return apiRequest<Quote>('/dashboard/quote/')
  }
}


export const formatToAPI = {
  priority: (priority: 'High' | 'Medium' | 'Low'): 'high' | 'medium' | 'low' => {
    const map = { High: 'high', Medium: 'medium', Low: 'low' } as const
    return map[priority]
  },

  status: (status: 'Completed' | 'Pending'): 'completed' | 'pending' => {
    const map = { Completed: 'completed', Pending: 'pending' } as const
    return map[status]
  }
}

export const formatFromAPI = {
  priority: (priority: 'high' | 'medium' | 'low'): 'High' | 'Medium' | 'Low' => {
    const map = { high: 'High', medium: 'Medium', low: 'Low' } as const
    return map[priority]
  },

  status: (status: 'completed' | 'pending' | 'in_progress'): 'Completed' | 'Pending' | 'In Progress' => {
    const map = { 
      completed: 'Completed', 
      pending: 'Pending', 
      in_progress: 'In Progress' 
    } as const
    return map[status]
  },

  task: (apiTask: Task): any => ({
    id: apiTask.id.toString(),
    title: apiTask.title,
    description: apiTask.description || '',
    category: apiTask.category,
    priority: formatFromAPI.priority(apiTask.priority),
    status: formatFromAPI.status(apiTask.status),
    dueDate: apiTask.due_date || '',
    createdAt: apiTask.created_at.split('T')[0],
    completed: apiTask.status === 'completed'
  })
}

export { TokenManager }
