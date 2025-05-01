
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import SearchBar from '../SearchBar';

interface QuotesHeaderProps {
  anyExpanded: boolean;
}

const QuotesHeader = ({ anyExpanded }: QuotesHeaderProps) => {
  return (
    <div className="bg-background border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: anyExpanded ? 0 : 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={anyExpanded ? 'hidden' : ''}
        >
          <div className="inline-flex items-center justify-center mb-3 bg-secondary/80 text-foreground px-3 py-1.5 rounded-full text-sm">
            <SearchIcon size={14} className="mr-1.5" />
            Discover Wisdom
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Find the Perfect Quote</h1>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Search through our curated collection of quotes from influential thinkers, designers, and visionaries.
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuotesHeader;
