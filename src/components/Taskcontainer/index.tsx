"use client";

import TaskItem from "./TaskItem";
import { useState, useMemo } from "react";
import Button from "../Button";
import { exportTasksToCSV } from "./utils";

interface TaskcontainerProps {
  tasks: any[]; // vindo do backend
  filters: {
    search: string;
    priority?: string;
    status?: string;
  };
  loading?: boolean;
  onUpdateTask?: (task: any) => void;
  onDeleteTask?: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void; // ← Adicionado
}

const ITEMS_PER_PAGE = 5;

export default function Taskcontainer({ 
  tasks, 
  filters, 
  loading,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete // ← Adicionado
}: TaskcontainerProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('dueDate');

  const filtered = useMemo(() => {
    let result = tasks;

    // Filtro por busca (título)
    if (filters.search) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro por prioridade
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Filtro por status
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    // Ordenação
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          // Colocar tarefas sem data no final
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, filters, sortBy]);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Resetar página quando filtros mudarem
  useMemo(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="bg-[#1f2937] rounded-xl p-4 mt-6">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-white font-semibold">
          My Tasks ({filtered.length})
        </h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="text-white border-gray-600 bg-[#1f2937] hover:bg-gray-700"
            onClick={() => exportTasksToCSV(filtered)}
          >
            Exportar CSV
          </Button>
          {/* Dropdown de ordenação melhorado */}
          <select 
            className="bg-[#1f2937] text-white border border-gray-600 rounded p-2 cursor-pointer hover:bg-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Ordenar por: Data de Vencimento</option>
            <option value="priority">Ordenar por: Prioridade</option>
            <option value="title">Ordenar por: Título</option>
            <option value="createdAt">Ordenar por: Data de Criação</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando tarefas...</p>
        </div>
      ) : (
        <>
          {/* Mostrar mensagem quando não há tasks */}
          {paginated.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhuma tarefa encontrada</p>
              {(filters.search || filters.priority || filters.status) && (
                <p className="text-sm mt-2">Tente ajustar os filtros</p>
              )}
            </div>
          ) : (
            paginated.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task}
                onToggleComplete={onToggleComplete} // ← Passando a prop
                onEdit={onUpdateTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </>
      )}

      {/* Paginação melhorada */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-between items-center mt-4 text-gray-400 text-sm">
          <span>
            Mostrando {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)} a{" "}
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} tarefas
          </span>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="text-white border-gray-600 disabled:opacity-50"
            >
              Anterior
            </Button>
            
            <span className="text-white px-2">
              Página {page} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="text-white border-gray-600 disabled:opacity-50"
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
