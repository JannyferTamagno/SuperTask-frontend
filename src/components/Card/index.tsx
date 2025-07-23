import { TrendingUp } from "lucide-react";

interface CardItem {
  label: string;
  value: string | number;
  percentage: number;
  color: string;
}

interface CardProps {
  title: string;
  items: CardItem[];
}

export function Card({ title, items }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {item.value}
              </span>
              <span 
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ 
                  backgroundColor: `${item.color}20`,
                  color: item.color 
                }}
              >
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
