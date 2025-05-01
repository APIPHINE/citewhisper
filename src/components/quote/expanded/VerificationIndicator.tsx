
import { Circle, Check } from 'lucide-react';

interface VerificationIndicatorProps {
  isVerified: boolean;
}

export function VerificationIndicator({ isVerified }: VerificationIndicatorProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      {isVerified ? (
        <div className="relative">
          <Circle size={24} className="text-[#6dbb6c] fill-[#6dbb6c]" />
          <Check size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      ) : (
        <Circle size={24} className="text-[#ea384c] fill-[#ea384c]" />
      )}
    </div>
  );
}
