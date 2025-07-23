
// Enums para valores específicos
export type TaskPriority = 'High' | 'Medium' | 'Low'
export type TaskStatus = 'Completed' | 'Pending' | 'In Progress'

// Interface para categoria
export interface TaskCategory {
  id: number
  name: string
  color: string // Hex color como #3b82f6
}

// Interface principal da Task (como armazenada no sistema)
export interface Task {
  id: string
  title: string
  description: string
  category: number
  priority: TaskPriority
  status: TaskStatus
  dueDate: string // ISO date string (YYYY-MM-DD)
  createdAt: string // ISO date string (YYYY-MM-DD)
  completed: boolean
  updatedAt?: string // Opcional para quando task é editada
  completedAt?: string // Opcional para quando task é marcada como concluída
}

// Interface para criar nova task (alguns campos são opcionais)
export interface NewTask {
  title: string
  description?: string // Opcional
  category: number
  priority: TaskPriority
  dueDate?: string // Opcional
}

// Interface para editar task (todos campos opcionais exceto ID)
export interface UpdateTask {
  id: string
  title?: string
  description?: string
  category?: number
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: string
  completed?: boolean
}

// Interface para filtros de task
export interface TaskFilters {
  search: string
  priority: string // Vazio ou um dos valores de TaskPriority
  status: string // Vazio ou um dos valores de TaskStatus
  category?: string // Opcional - nome da categoria
}

// Interface para estatísticas de tasks
export interface TaskStats {
  total: number
  completed: number
  pending: number
  overdue: number
  highPriority: number
  dueToday: number
}

// Interface para dados da API do dashboard
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

// Interface para resposta de listagem da API
export interface TaskListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Task[]
}

// Props para componentes
export interface BannerProps {
  userName?: string | null
  todaysTasks?: number | null
  onCreateTaskClick?: () => void // Função para abrir modal
}

export interface TaskItemProps {
  task: Task
  onToggleComplete?: (taskId: string) => void | Promise<void>
  onEdit?: (task: UpdateTask) => void | Promise<void>
  onDelete?: (taskId: string) => void | Promise<void>
}

export interface TaskContainerProps {
  tasks: Task[]
  filters: TaskFilters
  loading?: boolean
  onUpdateTask?: (task: UpdateTask) => void | Promise<void>
  onDeleteTask?: (taskId: string) => void | Promise<void>
  onToggleComplete?: (taskId: string) => void | Promise<void>
}

export interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (task: NewTask) => void | Promise<void>
  categories?: TaskCategory[] // Lista de categorias disponíveis
}

export interface FilterbarProps {
  filtros: TaskFilters
  setFiltros: (filters: TaskFilters) => void
  onExportCSV?: () => void
}

// Utility types para validação
export type TaskPriorityKey = keyof typeof TaskPriority
export type TaskStatusKey = keyof typeof TaskStatus

// Type guards para validação em runtime
export function isValidTaskPriority(priority: string): priority is TaskPriority {
  return ['High', 'Medium', 'Low'].includes(priority)
}

export function isValidTaskStatus(status: string): status is TaskStatus {
  return ['Completed', 'Pending', 'In Progress'].includes(status)
}

export function isValidTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.category === 'number' &&
    typeof obj.category.name === 'string' &&
    typeof obj.category.color === 'string' &&
    isValidTaskPriority(obj.priority) &&
    isValidTaskStatus(obj.status) &&
    typeof obj.dueDate === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.completed === 'boolean'
  )
}
