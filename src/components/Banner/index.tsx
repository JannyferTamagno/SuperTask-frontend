'use client'

import Button from '../Button'

interface BannerProps {
  userName?: string | null
  todaysTasks?: number | null
  onCreateTaskClick?: () => void // Função para abrir modal
}

export default function Banner({ 
  userName = null, 
  todaysTasks = null, 
  onCreateTaskClick 
}: BannerProps) {
  // Usar valores padrão quando não há dados da API
  const displayName = userName || "Usuário"
  const displayTasks = todaysTasks ?? 0

  const handleCreateTaskClick = () => {
    if (onCreateTaskClick) {
      onCreateTaskClick()
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 text-white rounded-lg p-6 flex justify-between items-center shadow-lg border border-blue-200 dark:border-blue-800">
      {/* Texto do lado esquerdo */}
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Bem-vindo de volta, {displayName}!
        </h2>
        {displayTasks === 0 ? (
          <p className="text-blue-100">Parabéns! Nenhuma tarefa com prazo para hoje.</p>
        ) : (
          <p className="text-blue-100">
            Você tem {displayTasks} tarefa{displayTasks > 1 ? 's' : ''} para completar hoje.
          </p>
        )}
      </div>

      {/* Botão do lado direito */}
      <div className="flex items-center">
        <Button 
          onClick={handleCreateTaskClick}
          className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-md"
        >
          + Criar tarefa
        </Button>
      </div>
    </div>
  )
}
