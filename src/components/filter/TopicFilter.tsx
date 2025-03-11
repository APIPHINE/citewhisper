
import React from 'react';
import FilterChip from './FilterChip';
import FilterSection from './FilterSection';
import { useSearch } from '../../context/SearchContext';

const TopicFilter = () => {
  const { filters, updateFilter, availableFilters } = useSearch();
  
  const toggleTopic = (topic: string) => {
    const newTopics = filters.topic.includes(topic)
      ? filters.topic.filter(t => t !== topic)
      : [...filters.topic, topic];
    
    updateFilter('topic', newTopics);
  };
  
  return (
    <FilterSection title="Topics">
      <div className="flex flex-wrap gap-2">
        {availableFilters.topics.map((topic) => (
          <FilterChip
            key={topic}
            label={topic}
            selected={filters.topic.includes(topic)}
            onClick={() => toggleTopic(topic)}
          />
        ))}
      </div>
    </FilterSection>
  );
};

export default TopicFilter;
