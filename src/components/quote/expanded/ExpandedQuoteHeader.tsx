
import { X, Edit } from 'lucide-react';
import { Quote } from '../../../utils/quotesData';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useEffect } from 'react';

interface ExpandedQuoteHeaderProps {
  quote: Quote;
  toggleExpanded: () => void;
  editMode?: boolean;
  onEditToggle?: () => void;
}

export function ExpandedQuoteHeader({ 
  quote, 
  toggleExpanded, 
  editMode = false,
  onEditToggle 
}: ExpandedQuoteHeaderProps) {
  const { user } = useAuth();
  const { userRole, loadRole } = useUserRoles();

  useEffect(() => {
    if (user?.id) {
      loadRole(user.id);
    }
  }, [user?.id, loadRole]);

  const isSuperAdmin = userRole === 'super_admin';

  return (
    <div className="flex items-center justify-between p-6 border-b border-border">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">
          {editMode ? 'Edit Quote' : 'Quote Details'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {quote.author} • {quote.date}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {isSuperAdmin && onEditToggle && (
          <Button
            onClick={onEditToggle}
            variant={editMode ? "secondary" : "outline"}
            size="sm"
          >
            <Edit size={16} className="mr-1" />
            {editMode ? 'Cancel Edit' : 'Edit'}
          </Button>
        )}
        
        <button
          onClick={toggleExpanded}
          className="p-2 hover:bg-secondary/80 rounded-full transition-colors"
          aria-label="Close quote details"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
