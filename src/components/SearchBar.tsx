import { Search } from 'lucide-react'
import { useApp } from '@/context/AppContext'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useApp()

  return (
    <label
      className={`glass-soft flex min-w-0 flex-1 items-center gap-3 rounded-full px-4 py-2.5 ${className}`}
    >
      <Search className="h-4 w-4 shrink-0 text-white/40" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search demos, platform, features..."
        className="w-full bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/35"
      />
    </label>
  )
}
