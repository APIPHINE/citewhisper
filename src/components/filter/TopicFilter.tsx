
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import FilterChip from './FilterChip';
import { useSearch } from '../../context/SearchContext';

const TopicFilter = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleTopic = (topic: string) => {
    const newTopics = filters.topic.includes(topic)
      ? filters.topic.filter(t => t !== topic)
      : [...filters.topic, topic];
    
    updateFilter('topic', newTopics);
  };
  
  // Filter topics based on search query
  const filteredTopics = searchQuery
    ? availableFilters.topics.filter(topic => 
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableFilters.topics;
  
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search topics..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto py-1">
        {filteredTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No topics match your search.</p>
        ) : (
          filteredTopics.map((topic) => (
            <FilterChip
              key={topic}
              label={topic}
              selected={filters.topic.includes(topic)}
              onClick={() => toggleTopic(topic)}
            />
          ))
        )}
      </div>
      
      {availableFilters.topics.length > 20 && !searchQuery && (
        <p className="text-xs text-muted-foreground mt-2">
          {availableFilters.topics.length} topics available. Use search to find specific topics.
        </p>
      )}
    </div>
  );
};

export default TopicFilter;
