
import FilterChip from './FilterChip';
import FilterSection from './FilterSection';
import { FilterOption } from '@/context/SearchContext';

interface TopicFilterProps {
  topics: string[];
  selectedTopics: string[];
  toggleFilter: (filterType: FilterOption, value: string) => void;
}

const TopicFilter = ({ 
  topics, 
  selectedTopics, 
  toggleFilter 
}: TopicFilterProps) => (
  <FilterSection title="Topic">
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <FilterChip
          key={topic}
          label={topic}
          selected={selectedTopics.includes(topic)}
          onClick={() => toggleFilter('topic', topic)}
        />
      ))}
    </div>
  </FilterSection>
);

export default TopicFilter;
