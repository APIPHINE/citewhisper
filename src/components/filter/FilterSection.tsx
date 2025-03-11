
import React from 'react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => (
  <div className="mb-6 last:mb-0">
    <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
    {children}
  </div>
);

export default FilterSection;
