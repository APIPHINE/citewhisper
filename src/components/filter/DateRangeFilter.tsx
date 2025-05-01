
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useSearch } from '../../context/SearchContext';
import { formatDateYear } from '../../utils/dateUtils';

// Date range constants
const MIN_YEAR = -2000; // 2000 BCE
const MAX_YEAR = 2025;  // 2025 CE
const RANGE = MAX_YEAR - MIN_YEAR;

const DateRangeFilter = () => {
  const { filters, updateFilter } = useSearch();
  
  // Convert filter dates to years for the slider
  const getYearFromDateString = (dateString: string | undefined) => {
    if (!dateString) return null;
    
    const bceMatch = dateString.match(/(\d+).*BCE/);
    if (bceMatch) {
      return -parseInt(bceMatch[1], 10); // Negative for BCE years
    }
    
    const ceYear = new Date(dateString).getFullYear();
    return isNaN(ceYear) ? null : ceYear;
  };
  
  const startYear = getYearFromDateString(filters.date.start) ?? MIN_YEAR;
  const endYear = getYearFromDateString(filters.date.end) ?? MAX_YEAR;
  
  // Convert years to normalized values for slider (0-100)
  const normalizedStart = ((startYear - MIN_YEAR) / RANGE) * 100;
  const normalizedEnd = ((endYear - MIN_YEAR) / RANGE) * 100;
  
  const [sliderValues, setSliderValues] = useState<number[]>([normalizedStart, normalizedEnd]);
  
  // Update slider when filters change
  useEffect(() => {
    setSliderValues([normalizedStart, normalizedEnd]);
  }, [normalizedStart, normalizedEnd]);
  
  // Handle slider change (real-time update)
  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
  };
  
  // Apply the filter when slider is released
  const applyDateRange = () => {
    if (sliderValues.length === 2) {
      // Convert normalized values back to years
      const newStartYear = Math.round((sliderValues[0] / 100) * RANGE + MIN_YEAR);
      const newEndYear = Math.round((sliderValues[1] / 100) * RANGE + MIN_YEAR);
      
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
    return formatDateYear(year);
  };
  
  // Calculate years from slider values
  const displayStartYear = Math.round((sliderValues[0] / 100) * RANGE + MIN_YEAR);
  const displayEndYear = Math.round((sliderValues[1] / 100) * RANGE + MIN_YEAR);
  
  // Reset date filter
  const resetDateRange = () => {
    updateFilter('date', { start: '', end: '' });
    setSliderValues([0, 100]);
  };

  return (
    <div className="space-y-4">
      <div className="px-1 pt-6 pb-2">
        <Slider
          value={sliderValues}
          max={100}
          step={0.1}
          onValueChange={handleSliderChange}
          onValueCommit={applyDateRange}
          className="mb-6"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatYear(displayStartYear)}</span>
          <span>{formatYear(displayEndYear)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">Range:</span>{' '}
          <span className="text-muted-foreground">
            {formatYear(displayStartYear)} — {formatYear(displayEndYear)}
          </span>
        </div>
        
        {(filters.date.start || filters.date.end) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetDateRange}
            className="text-xs h-7 px-2"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
