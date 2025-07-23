'use client'

import { X, Calendar, Flag, Folder, FileText } from 'lucide-react'
import Button from '../Button'
import { useState, useEffect } from 'react'
import type { NewTask, TaskCategory, TaskPriority, CreateTaskModalProps } from '@/types/task'

export default function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onCreateTask, 
  categories 
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState<NewTask>({
    title: '',
    description: '',
    category: 1,
    priority: 'Medium',
    dueDate: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        category: 1,
        priority: 'Medium',
        dueDate: ''
      })
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen, categories])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (formData.dueDate) {
      const today = new Date().toISOString().split('T')[0]
      if (formData.dueDate < today) {
        newErrors.dueDate = 'Data não pode ser no passado'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (!validateForm()) {
    return
  }

  setIsSubmitting(true)
  
  try {
    await onCreateTask(formData)
    
    onClose() 
    
  } catch (error) {
    console.error('Erro no componente:', error)
    setErrors({ submit: 'Erro ao criar tarefa. Tente novamente.' })
  } finally {
    setIsSubmitting(false)
  }
}

  const handleCategorySelect = (category: TaskCategory['id']) => {
    setFormData(prev => ({ ...prev, category }))
  }

  const handlePrioritySelect = (priority: TaskPriority) => {
    setFormData(prev => ({ ...prev, priority }))
  }

  const handleInputChange = (field: keyof NewTask, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">✨ Nova Tarefa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} />
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Finalizar apresentação do projeto"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">⚠️ {errors.title}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText size={16} />
              Descrição
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Adicione detalhes sobre a tarefa (opcional)..."
              rows={3}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Folder size={16} />
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories?.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    formData.category === category.id
                      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  disabled={isSubmitting}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Flag size={16} />
              Prioridade
            </label>
            <div className="flex gap-2">
              {(['Low', 'Medium', 'High'] as TaskPriority[]).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handlePrioritySelect(priority)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    formData.priority === priority
                      ? priority === 'High' 
                        ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : priority === 'Medium'
                        ? 'border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                        : 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                  disabled={isSubmitting}
                >
                  {priority === 'High' ? '🔴 Alta' : 
                   priority === 'Medium' ? '🟡 Média' : '🟢 Baixa'}
                </button>
              ))}
            </div>
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar size={16} />
              Data de Vencimento
            </label>
            <input
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              disabled={isSubmitting}
            />
            {errors.dueDate && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">⚠️ {errors.dueDate}</p>
            )}
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              💡 Deixe em branco se não houver prazo específico
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">❌ {errors.submit}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 dark:disabled:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando...
                </div>
              ) : (
                '✅ Criar Tarefa'
              )}
            </Button>
          </div>
        </form>

        {/* Footer Info */}
        <div className="px-6 pb-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            🎯 Dica: Use títulos descritivos para organizar melhor suas tarefas
          </p>
        </div>
      </div>
    </div>
  )
}
