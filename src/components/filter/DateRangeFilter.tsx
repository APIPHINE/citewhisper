
import { useState, useEffect } from 'react';
import FilterSection from './FilterSection';
import { Slider } from '@/components/ui/slider';
import { formatDateYear } from '@/utils/dateUtils';

interface DateRangeFilterProps {
  initialStart: number;
  initialEnd: number;
  onRangeChange: (range: [number, number]) => void;
}

const DateRangeFilter = ({ 
  initialStart, 
  initialEnd, 
  onRangeChange 
}: DateRangeFilterProps) => {
  const MIN_YEAR = -2000;
  const MAX_YEAR = 2025;
  
  const [dateRange, setDateRange] = useState<[number, number]>([
    initialStart, 
    initialEnd
  ]);
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    const [start, end] = values as [number, number];
    setDateRange([start, end]);
    onRangeChange([start, end]);
  };

  // Update local state if props change
  useEffect(() => {
    setDateRange([initialStart, initialEnd]);
  }, [initialStart, initialEnd]);

  return (
    <FilterSection title="Date Range">
      <div className="px-2 pt-6 pb-2">
        <Slider
          defaultValue={[MIN_YEAR, MAX_YEAR]}
          value={dateRange}
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          onValueChange={handleSliderChange}
          className="mb-6"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <div>
            <span className="font-medium text-foreground">{formatDateYear(dateRange[0])}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">{formatDateYear(dateRange[1])}</span>
          </div>
        </div>
      </div>
    </FilterSection>
  );
};

export default DateRangeFilter;
