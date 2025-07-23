'use client'

import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Buscar tarefas..." 
}: SearchInputProps) {
  return (
    <div className="flex items-center bg-[#1f2937] border border-[#374151] rounded px-3 py-2 w-full max-w-md text-[#f3f4f6]">
      <Search size={18} className="mr-2 text-[#f3f4f6]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none placeholder-[#f3f4f6] text-sm flex-1"
      />
    </div>
  )
}
