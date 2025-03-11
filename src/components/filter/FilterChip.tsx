
import { Check } from 'lucide-react';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const FilterChip = ({ label, selected, onClick }: FilterChipProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-250 ease-apple button-effect flex items-center ${
      selected 
        ? 'bg-primary text-primary-foreground font-medium' 
        : 'bg-secondary/50 hover:bg-secondary text-foreground'
    }`}
  >
    {selected && <Check size={14} className="mr-1.5" />}
    <span className="truncate">{label}</span>
  </button>
);

export default FilterChip;
