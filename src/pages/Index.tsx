
import { useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { CollectionsCarousel } from '../components/collections/CollectionsCarousel';
import QuotesHeader from '../components/quotes/QuotesHeader';
import QuotesContent from '../components/quotes/QuotesContent';
import { Footer } from '@/components/Footer';

const Index = () => {
  const { filteredQuotes, searchQuery } = useSearch();
  const [mounted, setMounted] = useState(false);
  const [anyExpanded, setAnyExpanded] = useState(false);
  
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
          />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Index;
