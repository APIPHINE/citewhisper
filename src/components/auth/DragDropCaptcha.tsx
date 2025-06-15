
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, Circle, Square, Triangle, Diamond } from 'lucide-react';

interface DragDropCaptchaProps {
  onVerificationChange: (verified: boolean) => void;
  className?: string;
}

const SHAPES = [
  { id: 'circle', Icon: Circle },
  { id: 'square', Icon: Square },
  { id: 'triangle', Icon: Triangle },
  { id: 'diamond', Icon: Diamond },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};


export const DragDropCaptcha: React.FC<DragDropCaptchaProps> = ({
  onVerificationChange,
  className = ""
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const [correctShape, setCorrectShape] = useState(SHAPES[0]);
  const [targetShapes, setTargetShapes] = useState(shuffleArray(SHAPES));

  const draggableRef = useRef<HTMLDivElement>(null);

  const randomizeCaptcha = useCallback(() => {
    const shuffledShapes = shuffleArray(SHAPES);
    setCorrectShape(shuffledShapes[0]);
    setTargetShapes(shuffleArray(SHAPES));
  }, []);

  useEffect(() => {
    randomizeCaptcha();
  }, [randomizeCaptcha]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const targetElement = e.currentTarget as HTMLDivElement;
    const droppedOnShapeId = targetElement.dataset.shapeId;

    if (droppedOnShapeId === correctShape.id) {
      setIsVerified(true);
      setShowFeedback(true);
      onVerificationChange(true);
    } else {
      setIsVerified(false);
      onVerificationChange(false);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    }
    
    setIsDragging(false);
  }, [onVerificationChange, correctShape.id]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetCaptcha = () => {
    setIsVerified(false);
    setShowFeedback(false);
    onVerificationChange(false);
    randomizeCaptcha();
  };

  return (
    <div className={`p-4 border rounded-lg bg-secondary/20 ${className}`}>
      <div className="mb-2 text-sm font-medium">
        Verify you're human: Drag the shape to the matching area.
      </div>
      
      <div className="relative flex items-center justify-between min-h-[100px]">
        {/* Draggable Shape */}
        <div className="flex-1 flex justify-start">
          {!isVerified && (
            <div
              ref={draggableRef}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              className={`w-12 h-12 bg-blue-500 rounded-lg cursor-move flex items-center justify-center text-white transition-transform ${
                isDragging ? 'opacity-50 scale-110' : 'hover:scale-105'
              }`}
            >
              <correctShape.Icon className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Drop Zones */}
        <div className="flex-1 flex justify-end items-center gap-2">
           {isVerified 
            ? (
                <div className={`w-16 h-16 border-2 border-green-500 bg-green-50 rounded-lg flex items-center justify-center`}>
                  <correctShape.Icon className="w-8 h-8 text-green-500" />
                </div>
              )
            : (
              targetShapes.map(shape => (
                <div
                  key={shape.id}
                  data-shape-id={shape.id}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors border-gray-400 hover:border-blue-500`}
                >
                  <shape.Icon className="w-8 h-8 text-gray-400" />
                </div>
              ))
            )
          }
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
