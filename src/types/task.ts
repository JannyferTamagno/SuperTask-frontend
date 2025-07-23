export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Completed' | 'Pending' | 'In Progress';

export interface TaskCategory {
  id: number;
  name: string;
  color: string; 
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: number;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; 
  createdAt: string; 
  completed: boolean;
  updatedAt?: string; 
  completedAt?: string; 
}

export interface NewTask {
  title: string;
  description?: string; 
  category: number;
  priority: TaskPriority;
  dueDate?: string; 
}

export interface UpdateTask {
  id: string;
  title?: string;
  description?: string;
  category?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  completed?: boolean;
}

export interface TaskFilters {
  search: string;
  priority: string; 
  status: string; 
  category?: string; 
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  dueToday: number;
}

export interface DashboardStats {
  completed: number;
  in_progress: number;
  overdue: number;
  high_priority: number;
  due_today: number;
  total_tasks: number;
  categories_stats: Record<
    string,
    {
      total: number;
      completed: number;
      pending: number;
    }
  >;
}

export interface TaskListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export interface BannerProps {
  userName?: string | null;
  todaysTasks?: number | null;
  onCreateTaskClick?: () => void; 
}

export interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void | Promise<void>;
  onEdit?: (task: UpdateTask) => void | Promise<void>;
  onDelete?: (taskId: string) => void | Promise<void>;
}

export interface TaskContainerProps {
  tasks: Task[];
  filters: TaskFilters;
  loading?: boolean;
  onUpdateTask?: (task: UpdateTask) => void | Promise<void>;
  onDeleteTask?: (taskId: string) => void | Promise<void>;
  onToggleComplete?: (taskId: string) => void | Promise<void>;
}

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: NewTask) => void | Promise<void>;
  categories?: TaskCategory[]; 
}

export interface FilterbarProps {
  filtros: TaskFilters;
  setFiltros: (filters: TaskFilters) => void;
  onExportCSV?: () => void;
}


export function isValidTaskPriority(
  priority: string,
): priority is TaskPriority {
  return ['High', 'Medium', 'Low'].includes(priority);
}

export function isValidTaskStatus(status: string): status is TaskStatus {
  return ['Completed', 'Pending', 'In Progress'].includes(status);
}

export function isValidTask(obj: any): obj is Task {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.category === 'number' && 
    isValidTaskPriority(obj.priority) &&
    isValidTaskStatus(obj.status) &&
    typeof obj.dueDate === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.completed === 'boolean'
  );
}
