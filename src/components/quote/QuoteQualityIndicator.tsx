import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QualityScore {
  overall: number;
  completeness: number;
  accuracy: number;
  sourcing: number;
}

export interface QualitySuggestion {
  type: 'missing' | 'improve' | 'verify' | 'enhance';
  field: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface QuoteQualityIndicatorProps {
  score: QualityScore;
  suggestions: QualitySuggestion[];
  className?: string;
}

export function QuoteQualityIndicator({ score, suggestions, className }: QuoteQualityIndicatorProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (value: number) => {
    if (value >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (value >= 60) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className={cn("space-y-4 p-4 bg-card rounded-lg border", className)}>
      {/* Overall Quality Score */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            {getScoreIcon(score.overall)}
            Quote Quality Score
          </h3>
          <span className={cn("text-lg font-bold", getScoreColor(score.overall))}>
            {Math.round(score.overall)}%
          </span>
        </div>
        <Progress value={score.overall} className="h-2" />
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Completeness</span>
            <span className={getScoreColor(score.completeness)}>
              {Math.round(score.completeness)}%
            </span>
          </div>
          <Progress value={score.completeness} className="h-1" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Accuracy</span>
            <span className={getScoreColor(score.accuracy)}>
              {Math.round(score.accuracy)}%
            </span>
          </div>
          <Progress value={score.accuracy} className="h-1" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sourcing</span>
            <span className={getScoreColor(score.sourcing)}>
              {Math.round(score.sourcing)}%
            </span>
          </div>
          <Progress value={score.sourcing} className="h-1" />
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4" />
            Suggestions for Improvement
          </h4>
          <div className="space-y-2">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded text-sm">
                <Badge 
                  variant={getPriorityBadgeVariant(suggestion.priority)}
                  className="text-xs px-1 py-0 h-5"
                >
                  {suggestion.priority}
                </Badge>
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{suggestion.field}</div>
                  <div className="text-muted-foreground text-xs">{suggestion.message}</div>
                </div>
              </div>
            ))}
            {suggestions.length > 3 && (
              <div className="text-xs text-muted-foreground text-center">
                +{suggestions.length - 3} more suggestions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}