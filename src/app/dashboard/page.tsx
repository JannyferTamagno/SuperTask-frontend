'use client'

import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import Banner from '@/components/Banner'
import { Card } from "@/components/Card";
import Filterbar from '@/components/Filterbar'
import Navbar from '@/components/Navbar'
import StatsContainer from '@/components/Statscontainer';
import QuoteContainer from "@/components/Quotecontainer";
import CategoriesCard from "@/components/Categoriescard";
import Taskcontainer from "@/components/Taskcontainer";
import  CreateTaskModal  from '@/components/CreateTaskModal';
import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { tasksAPI, dashboardAPI, formatToAPI, formatFromAPI, Task, DashboardStats, Quote } from '@/api';
import type { NewTask, TaskFilters } from '@/types/task';
import { useCategories } from '@/hooks/useCategories';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<TaskFilters>({
    search: '',
    priority: '',
    status: '',
  });

  const modalCategories = useCategories();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const loadDashboardData = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const [tasksResponse, statsResponse, quoteResponse] = await Promise.all([
        tasksAPI.list(),
        dashboardAPI.getStats(),
        dashboardAPI.getQuote()
      ]);

      const frontendTasks = tasksResponse.results.map((apiTask: Task) => {
        const localCategory = modalCategories.find(cat => cat.name === apiTask.category_name);
        return {
          id: apiTask.id.toString(),
          title: apiTask.title,
          description: apiTask.description || '',
          category: {
            name: apiTask.category_name || 'Sem categoria',
            color: localCategory?.color || '#6b7280'
          },
          priority: formatFromAPI.priority(apiTask.priority),
          status: formatFromAPI.status(apiTask.status),
          dueDate: apiTask.due_date || '',
          createdAt: apiTask.created_at.split('T')[0],
          completed: apiTask.status === 'completed'
        };
      });

      const today = new Date().toISOString().split('T')[0];
      const dueTodayCount = frontendTasks.filter(task => task.dueDate === today).length;

      setTasks(frontendTasks);
      setDashboardStats({
        ...statsResponse,
        due_today: dueTodayCount
      });
      setQuote(quoteResponse);

    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAuthenticated]);

  const applyFilters = async (filters: TaskFilters) => {
    setFiltrosSelecionados(filters);
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const apiFilters: any = {};

      if (filters.priority) {
        apiFilters.priority = formatToAPI.priority(filters.priority as 'High' | 'Medium' | 'Low');
      }

      if (filters.status) {
        apiFilters.status = formatToAPI.status(filters.status as 'Completed' | 'Pending');
      }

      const tasksResponse = await tasksAPI.list(apiFilters);

      let frontendTasks = tasksResponse.results.map((apiTask: Task) => {
        const localCategory = modalCategories.find(cat => cat.name === apiTask.category_name);
        return {
          id: apiTask.id.toString(),
          title: apiTask.title,
          description: apiTask.description || '',
          category: {
            name: apiTask.category_name || 'Sem categoria',
            color: localCategory?.color || '#6b7280'
          },
          priority: formatFromAPI.priority(apiTask.priority),
          status: formatFromAPI.status(apiTask.status),
          dueDate: apiTask.due_date || '',
          createdAt: apiTask.created_at.split('T')[0],
          completed: apiTask.status === 'completed'
        };
      });

      if (filters.search) {
        frontendTasks = frontendTasks.filter((task: any) =>
          task.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setTasks(frontendTasks);

    } catch (err) {
      console.error('Erro ao filtrar tarefas:', err);
      setError('Erro ao filtrar tarefas');
    } finally {
      setLoading(false);
    }
  };

const handleCreateTask = async (newTaskData: NewTask) => {
  try {

    const apiTaskData = {
      title: newTaskData.title,
      description: newTaskData.description || undefined,
      priority: formatToAPI.priority(newTaskData.priority),
      due_date: newTaskData.dueDate || undefined,
      category: newTaskData.category || undefined
    };

    console.log('📦 Dados enviados à API:', apiTaskData);

    await tasksAPI.create(apiTaskData);
    await loadDashboardData();

  } catch (err) {
    console.error('❌ Erro ao criar tarefa:', err);
    setError('Erro ao criar tarefa');
    throw err;
  }
};


  const handleUpdateTask = async (updatedTask: any) => {
  try {
    const categoryId = updatedTask.category?.name !== 'Sem categoria'
      ? updatedTask.category?.id
      : null;

    const apiTaskData = {
      title: updatedTask.title,
      description: updatedTask.description || undefined,
      priority: formatToAPI.priority(updatedTask.priority),
      status: formatToAPI.status(updatedTask.status),
      due_date: updatedTask.dueDate || undefined,
      category_id: categoryId || undefined
    };

    await tasksAPI.update(parseInt(updatedTask.id), apiTaskData);
    await loadDashboardData();

  } catch (err) {
    console.error('Erro ao atualizar tarefa:', err);
    setError('Erro ao atualizar tarefa');
  }
};


  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.delete(parseInt(taskId));
      await loadDashboardData();
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      setError('Erro ao deletar tarefa');
    }
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    try {
      await tasksAPI.toggleStatus(parseInt(taskId));
      await loadDashboardData();
    } catch (err) {
      console.error('Erro ao alternar status da tarefa:', err);
      setError('Erro ao alternar status da tarefa');
    }
  };

  const handleExportCSV = () => {
    if (tasks.length === 0) {
      alert('Nenhuma tarefa para exportar');
      return;
    }

    const header = "Title,Description,Due Date,Category,Priority,Status,Created At\n";
    const rows = tasks.map((task: any) =>
      [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.dueDate || '',
        task.category.name,
        task.priority,
        task.status,
        task.createdAt,
      ].join(",")
    );

    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `tasks_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando dados da API...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.first_name || user?.username || null;
  const todaysTasks = dashboardStats?.due_today || 0;

  const cardStats = dashboardStats ? [
    {
      label: "Completo",
      value: `${dashboardStats.completed}/${dashboardStats.total_tasks}`,
      percentage: dashboardStats.total_tasks > 0
        ? Math.round((dashboardStats.completed / dashboardStats.total_tasks) * 100)
        : 0,
      color: "#22c55e"
    },
    {
      label: "Pendente",
      value: `${dashboardStats.total_tasks - dashboardStats.completed}`,
      percentage: dashboardStats.total_tasks > 0
        ? Math.round(((dashboardStats.total_tasks - dashboardStats.completed) / dashboardStats.total_tasks) * 100)
        : 0,
      color: "#eab308"
    },
    {
      label: "Vencido",
      value: `${dashboardStats.overdue}`,
      percentage: dashboardStats.total_tasks > 0
        ? Math.round((dashboardStats.overdue / dashboardStats.total_tasks) * 100)
        : 0,
      color: "#ef4444"
    },
  ] : [];

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Navbar />

        <div className="mx-4 mt-4">
          {error ? (
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-lg text-sm">
              ❌ Erro: {error}
              <button
                onClick={loadDashboardData}
                className="ml-2 underline hover:no-underline text-red-600 dark:text-red-400"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 rounded-lg text-sm">
              ✅ Iniciado com sucesso - {tasks.length} tarefa(s) carregada(s)
            </div>
          )}
        </div>

        <div className="grid grid-cols-8 gap-4 px-4 py-6">
          <div className="col-span-2 p-4 rounded-lg">
            <QuoteContainer quote={quote} />
            <br />
            {cardStats.length > 0 && (
              <>
                <Card title="Status do dia" items={cardStats} />
                <br />
              </>
            )}
            <CategoriesCard categories={modalCategories} />
          </div>

          <div className="col-span-6 p-4 rounded-lg">
            <Banner
              userName={userName}
              todaysTasks={todaysTasks}
              onCreateTaskClick={() => setIsCreateModalOpen(true)}
            />
            <br />

            <Filterbar
              filtros={filtrosSelecionados}
              setFiltros={applyFilters}
            />
            <br />

            <div className="flex justify-between items-center w-full">
              <StatsContainer
                icon={<AlertTriangle className="text-yellow-500" />}
                title="Tarefas de prioridade alta"
                value={dashboardStats?.high_priority || 0}
                bgColor="#7f1d1d"
              />
              <StatsContainer
                icon={<Clock className="text-blue-500" />}
                title="Tarefas que vão vencer no dia de hoje"
                value={dashboardStats?.due_today || 0}
                bgColor="#b45309"
              />
              <StatsContainer
                icon={<CheckCircle className="text-green-500" />}
                title="Tarefas que você já completou"
                value={dashboardStats?.completed || 0}
                bgColor="#065f46"
              />
            </div>
            <br />

            <Taskcontainer
            tasks={tasks}
            filters={filtrosSelecionados}
            loading={loading}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleTaskStatus}
            />
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
        categories={modalCategories}
      />
    </>
  );
}
