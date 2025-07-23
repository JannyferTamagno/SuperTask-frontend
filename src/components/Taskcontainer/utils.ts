import type { Task } from '@/types/task'

export function exportTasksToCSV(tasks: Task[]): void {
  const header = "Title,Description,Due Date,Category,Priority,Status,Created At\n"
  const rows = tasks.map((task) =>
    [
      `"${task.title.replace(/"/g, '""')}"`, 
      `"${(task.description || '').replace(/"/g, '""')}"`,
      task.dueDate || '',
      task.category,
      task.priority,
      task.status,
      task.createdAt,
    ].join(",")
  )
  
  const csvContent = header + rows.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement("a")
  link.href = url
  link.download = `tasks_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}
