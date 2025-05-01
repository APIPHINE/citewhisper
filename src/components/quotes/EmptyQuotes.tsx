
import { Search as SearchIcon } from 'lucide-react';

const EmptyQuotes = () => {
  return (
    <div className="bg-secondary/50 text-center py-16 px-6 rounded-2xl mt-8 border border-border">
      <SearchIcon size={40} className="mx-auto mb-4 text-muted-foreground/50" />
      <h2 className="text-xl font-medium mb-2">No quotes found</h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
    </div>
  );
};

export default EmptyQuotes;
