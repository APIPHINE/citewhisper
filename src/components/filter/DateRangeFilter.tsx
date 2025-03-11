
import React from 'react';
import { Slider } from '@/components/ui/slider';
import FilterSection from './FilterSection';
import { useSearch } from '../../context/SearchContext';

// Date range constants
const MIN_YEAR = -2000; // 2000 BCE
const MAX_YEAR = 2025;  // 2025 CE
const RANGE = MAX_YEAR - MIN_YEAR;

const DateRangeFilter = () => {
  const { filters, updateFilter } = useSearch();
  
  // Convert filter dates to slider values
  const startYear = filters.date.start 
    ? new Date(filters.date.start).getFullYear() 
    : MIN_YEAR;
    
  const endYear = filters.date.end 
    ? new Date(filters.date.end).getFullYear() 
    : MAX_YEAR;
  
  // Convert years to normalized values for slider (0-100)
  const normalizedStart = ((startYear - MIN_YEAR) / RANGE) * 100;
  const normalizedEnd = ((endYear - MIN_YEAR) / RANGE) * 100;
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    if (values.length === 2) {
      // Convert normalized values back to years
      const newStartYear = Math.round((values[0] / 100) * RANGE + MIN_YEAR);
      const newEndYear = Math.round((values[1] / 100) * RANGE + MIN_YEAR);
      
      // Convert years to date strings
      const startDate = newStartYear < 0 
        ? `${Math.abs(newStartYear)}-01-01 BCE` 
        : `${newStartYear}-01-01`;
        
      const endDate = newEndYear < 0 
        ? `${Math.abs(newEndYear)}-12-31 BCE` 
        : `${newEndYear}-12-31`;
      
      updateFilter('date', { start: startDate, end: endDate });
    }
  };
  
  // Format year for display
  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  return (
    <FilterSection title="Date Range">
      <div className="px-1 pt-6 pb-2">
        <Slider
          defaultValue={[normalizedStart, normalizedEnd]}
          max={100}
          step={0.1}
          onValueChange={handleSliderChange}
          className="mb-6"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatYear(startYear)}</span>
          <span>{formatYear(endYear)}</span>
        </div>
      </div>
    </FilterSection>
  );
};

export default DateRangeFilter;
