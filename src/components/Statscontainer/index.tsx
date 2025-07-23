import { ReactNode } from 'react';

interface StatsContainerProps {
  icon: ReactNode;
  title: string;
  value: number | string;
  bgColor?: string;
}

export default function StatsContainer({ icon, title, value, bgColor = "#1f2937" }: StatsContainerProps) {
  return (
    <div 
      className="rounded-xl p-4 min-w-[150px] border border-gray-200 dark:border-gray-600 transition-colors"
      style={{ 
        backgroundColor: bgColor,
        opacity: 0.9 
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-medium text-white/80 mb-1 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
