
import React, { useState, useRef, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface DragDropCaptchaProps {
  onVerificationChange: (verified: boolean) => void;
  className?: string;
}

export const DragDropCaptcha: React.FC<DragDropCaptchaProps> = ({
  onVerificationChange,
  className = ""
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showFeedback, setShowFeedback] = useState(false);
  
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!dropZoneRef.current) return;
    
    const dropRect = dropZoneRef.current.getBoundingClientRect();
    const isInDropZone = 
      e.clientX >= dropRect.left &&
      e.clientX <= dropRect.right &&
      e.clientY >= dropRect.top &&
      e.clientY <= dropRect.bottom;

    if (isInDropZone) {
      setIsVerified(true);
      setShowFeedback(true);
      onVerificationChange(true);
      setTimeout(() => setShowFeedback(false), 3000);
    } else {
      setIsVerified(false);
      onVerificationChange(false);
    }
    
    setIsDragging(false);
  }, [onVerificationChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetCaptcha = () => {
    setIsVerified(false);
    setShowFeedback(false);
    onVerificationChange(false);
  };

  return (
    <div className={`p-4 border rounded-lg bg-secondary/20 ${className}`}>
      <div className="mb-2 text-sm font-medium">
        Verify you're human: Drag the circle to the target area
      </div>
      
      <div className="relative flex items-center justify-between min-h-[100px]">
        {/* Draggable Circle */}
        <div className="flex-1 flex justify-start">
          {!isVerified && (
            <div
              ref={draggableRef}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className={`w-12 h-12 bg-blue-500 rounded-full cursor-move flex items-center justify-center text-white font-bold transition-transform ${
                isDragging ? 'opacity-50 scale-110' : 'hover:scale-105'
              }`}
            >
              ●
            </div>
          )}
        </div>

        {/* Drop Zone */}
        <div className="flex-1 flex justify-end">
          <div
            ref={dropZoneRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`w-16 h-16 border-2 border-dashed rounded-full flex items-center justify-center transition-colors ${
              isVerified 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-400 hover:border-blue-500'
            }`}
          >
            {isVerified ? (
              <CheckCircle className="w-8 h-8 text-green-500" />
            ) : (
              <div className="text-gray-400 text-xs text-center">Drop here</div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          {isVerified ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Verification successful!</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Please try again</span>
            </>
          )}
        </div>
      )}

      {/* Reset button */}
      {isVerified && (
        <button
          type="button"
          onClick={resetCaptcha}
          className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Reset verification
        </button>
      )}
    </div>
  );
};
