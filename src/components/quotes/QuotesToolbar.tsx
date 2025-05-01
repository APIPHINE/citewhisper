
import { LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterMenu from '../FilterMenu';
import SortMenu from '../SortMenu';

interface QuotesToolbarProps {
  filteredQuotesCount: number;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const QuotesToolbar = ({ 
  filteredQuotesCount, 
  searchQuery, 
  viewMode, 
  setViewMode,
  toggleSidebar,
  sidebarOpen
}: QuotesToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="flex items-center text-muted-foreground">
        <Button variant="outline" size="sm" onClick={toggleSidebar} className="md:hidden mr-4">
          {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
        <span>
          <span className="font-medium text-foreground">{filteredQuotesCount}</span>
          <span className="ml-1.5">
            {filteredQuotesCount === 1 ? 'quote' : 'quotes'} found
          </span>
          {searchQuery && (
            <span className="ml-1">for "{searchQuery}"</span>
          )}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* View mode toggle */}
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 rounded-none px-3 ${viewMode === 'grid' ? 'bg-secondary text-foreground' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-9 rounded-none px-3 ${viewMode === 'list' ? 'bg-secondary text-foreground' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <LayoutList size={18} />
          </Button>
        </div>
        
        <FilterMenu />
        <SortMenu />
      </div>
    </div>
  );
};

export default QuotesToolbar;
