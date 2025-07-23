import { useMemo } from 'react'

export interface Category {
  id: number
  name: string
  color: string
}

export const defaultCategories: Category[] = [
  { id: 1, name: 'Trabalho', color: '#3b82f6' },
  { id: 2, name: 'Estudos', color: '#10b981' },
  { id: 3, name: 'Lazer', color: '#f59e0b' },
  { id: 4, name: 'Pessoal', color: '#ef4444' },
]

export function useCategories(userCategories: Category[] = []) {
  const categories = useMemo(() => {
    const uniqueUserCategories = userCategories.filter(
      (userCat) =>
        !defaultCategories.some((defCat) => defCat.name === userCat.name)
    )

    const startingId = defaultCategories.length + 1
    const userCategoriesWithIds = uniqueUserCategories.map((cat, index) => ({
      ...cat,
      id: startingId + index,
    }))

    return [...defaultCategories, ...userCategoriesWithIds]
  }, [userCategories])

  return categories
}
