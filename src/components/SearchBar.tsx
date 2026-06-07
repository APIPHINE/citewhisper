import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = 'Search quotes...' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); }}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;
