import { Folder, Plus } from 'lucide-react';

interface Category {
  name: string;
  color: string;
}

interface CategoriesCardProps {
  categories: Category[];
}

export default function CategoriesCard({ categories }: CategoriesCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Folder size={20} className="text-blue-600 dark:text-blue-400" />
          Categorias
        </h3>
        <button 
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20"
          title="Adicionar categoria"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category.name}
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Nenhuma categoria disponível
            </p>
            <button className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline">
              Criar primeira categoria
            </button>
          </div>
        )}
      </div>
  
    </div>
  );
}
