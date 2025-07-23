import { Calendar, Clock, Folder, Edit, Trash2, MoreVertical } from 'lucide-react';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
    category: {
      name: string;
      color: string;
    };
    priority: 'High' | 'Medium' | 'Low';
    status: 'Completed' | 'Pending' | 'In Progress';
    dueDate?: string;
    createdAt: string;
    completed: boolean;
  };
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: any) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const handleCheckboxChange = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete && confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = dateOnly.getTime() - todayOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'hoje';
    if (diffDays === 1) return 'amanhã';
    if (diffDays === -1) return 'ontem';
    if (diffDays > 1) return `em ${diffDays} dias`;
    if (diffDays < -1) return `há ${Math.abs(diffDays)} dias`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const isDueToday = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'High': return 'Alta';
      case 'Medium': return 'Média';
      case 'Low': return 'Baixa';
      default: return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Completed': return 'Completa';
      case 'In Progress': return 'Em andamento';
      case 'Pending': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div 
      className={`flex border-l-4 rounded-md p-4 mb-3 items-start justify-between hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 ${
        task.completed 
          ? 'bg-gray-100 dark:bg-gray-700 opacity-75' 
          : 'bg-gray-50 dark:bg-gray-700'
      }`}
      style={{ borderLeftColor: task.category.color }}
    >
      <div className="flex items-start gap-3 flex-1">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={handleCheckboxChange}
          className="mt-1 cursor-pointer accent-blue-600 w-4 h-4" 
          disabled={!onToggleComplete} 
        />
        <div className="space-y-2 flex-1">
          <h3 className={`font-semibold ${
            task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm ${
              task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-300"
            }`}>
              {task.description}
            </p>
          )}
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <span className={`${
                  isOverdue() ? 'text-red-500 dark:text-red-400 font-medium' : 
                  isDueToday() ? 'text-yellow-600 dark:text-yellow-400 font-medium' : 
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  Vence {formatDate(task.dueDate)}
                  {isOverdue() && ' (Vencida)'}
                  {isDueToday() && ' (Hoje)'}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Folder size={12} />
              {task.category.name}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Criada {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 ml-4">
        {/* Priority Badge */}
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            task.priority === "High"
              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
              : task.priority === "Medium"
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
              : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
          }`}
        >
          {getPriorityLabel(task.priority)}
        </span>
        
        {/* Status Badge */}
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            task.status === "Completed"
              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
              : task.status === "In Progress"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
              : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
          }`}
        >
          {getStatusLabel(task.status)}
        </span>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onEdit && (
            <button 
              onClick={handleEditClick}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer transition-colors p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20"
              title="Editar tarefa"
            >
              <Edit size={14} />
            </button>
          )}
          
          {onDelete && (
            <button 
              onClick={handleDeleteClick}
              className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer transition-colors p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
              title="Excluir tarefa"
            >
              <Trash2 size={14} />
            </button>
          )}
          
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
