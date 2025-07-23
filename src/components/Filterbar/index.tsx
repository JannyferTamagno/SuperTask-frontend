'use client'

import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/Button';

interface TaskFilters {
  search: string;
  priority: string;
  status: string;
}

interface FilterbarProps {
  filtros: TaskFilters;
  setFiltros: (filtros: TaskFilters) => void;
}

export default function Filterbar({ filtros, setFiltros }: FilterbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    setFiltros({
      ...filtros,
      [key]: value
    });
  };

  const clearFilters = () => {
    setFiltros({
      search: '',
      priority: '',
      status: ''
    });
  };

  const hasActiveFilters = filtros.search || filtros.priority || filtros.status;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Filtros à esquerda */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Campo de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={filtros.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors min-w-[200px] placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Filtros expandidos ou compactos */}
          <div className={`flex flex-col sm:flex-row gap-3 ${isExpanded ? 'block' : 'hidden sm:flex'}`}>
            {/* Filtro de prioridade */}
            <select
              value={filtros.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
            >
              <option value="">Todas as prioridades</option>
              <option value="High">🔴 Alta</option>
              <option value="Medium">🟡 Média</option>
              <option value="Low">🟢 Baixa</option>
            </select>

            {/* Filtro de status */}
            <select
              value={filtros.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors cursor-pointer"
            >
              <option value="">Todos os status</option>
              <option value="Pending">📋 Pendente</option>
              <option value="In Progress">⏳ Em andamento</option>
              <option value="Completed">✅ Completa</option>
            </select>
          </div>

          {/* Botão para expandir filtros em mobile */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="sm:hidden flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <Filter size={16} />
            {isExpanded ? 'Menos filtros' : 'Mais filtros'}
          </button>
        </div>

        {/* Botões de ação à direita */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Botão de limpar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <X size={16} />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Indicadores de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Filtros ativos:</span>
          
          {filtros.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-md">
              Busca: "{filtros.search}"
              <button
                onClick={() => handleFilterChange('search', '')}
                className="hover:text-blue-600 dark:hover:text-blue-300 ml-1"
                title="Remover filtro de busca"
              >
                <X size={12} />
              </button>
            </span>
          )}
          
          {filtros.priority && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-md">
              Prioridade: {filtros.priority === 'High' ? '🔴 Alta' : filtros.priority === 'Medium' ? '🟡 Média' : '🟢 Baixa'}
              <button
                onClick={() => handleFilterChange('priority', '')}
                className="hover:text-yellow-600 dark:hover:text-yellow-300 ml-1"
                title="Remover filtro de prioridade"
              >
                <X size={12} />
              </button>
            </span>
          )}
          
          {filtros.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-md">
              Status: {filtros.status === 'Completed' ? '✅ Completa' : filtros.status === 'In Progress' ? '⏳ Em andamento' : '📋 Pendente'}
              <button
                onClick={() => handleFilterChange('status', '')}
                className="hover:text-green-600 dark:hover:text-green-300 ml-1"
                title="Remover filtro de status"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Resumo dos resultados */}
      {hasActiveFilters && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          💡 Use os filtros para encontrar tarefas específicas rapidamente
        </div>
      )}
    </div>
  );
}
