
import { useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { CollectionsCarousel } from '../components/collections/CollectionsCarousel';
import QuotesHeader from '../components/quotes/QuotesHeader';
import QuotesContent from '../components/quotes/QuotesContent';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';

const Index = () => {
  const { filteredQuotes, searchQuery } = useSearch();
  const [mounted, setMounted] = useState(false);
  const [anyExpanded, setAnyExpanded] = useState(false);
  const { user } = useAuth();
  const { userRole, loadRole } = useUserRoles();

  useEffect(() => {
    if (user?.id) {
      loadRole(user.id);
    }
  }, [user?.id, loadRole]);

  const isAdmin = ['admin', 'super_admin'].includes(userRole);
  
  // Set mounted after initial render to ensure animations work properly
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  return (
    <>
      <div className="min-h-screen pb-20">
        <QuotesHeader anyExpanded={anyExpanded} />

        <div className="max-w-7xl mx-auto px-4 mt-8">
          <CollectionsCarousel />
          
          <QuotesContent
            quotes={filteredQuotes}
            searchQuery={searchQuery}
            anyExpanded={anyExpanded}
            setAnyExpanded={setAnyExpanded}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </>
  );
};

export default Index;
