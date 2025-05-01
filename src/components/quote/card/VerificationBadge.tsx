
import { Circle, Check } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
}

export function VerificationBadge({ isVerified }: VerificationBadgeProps) {
  return isVerified ? (
    <div className="relative">
      <Circle size={24} className="text-[#6dbb6c] fill-[#6dbb6c]" />
      <Check size={16} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  ) : (
    <Circle size={24} className="text-[#ea384c] fill-[#ea384c]" />
  );
}
