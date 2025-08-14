import { useState } from 'react';
import { Activity, ChevronDown, Clock, Zap } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function PerformanceMonitor() {
  const { metrics, apiMetrics, getPerformanceScore } = usePerformanceMonitor();
  const [isOpen, setIsOpen] = useState(false);
  
  const performanceScore = getPerformanceScore();
  
  if (!metrics) return null;

  const formatTime = (time: number) => `${Math.round(time)}ms`;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const recentAPIErrors = apiMetrics.filter(m => !m.success).slice(-5);
  const avgAPITime = apiMetrics.length > 0 
    ? Math.round(apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length)
    : 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-lg"
        >
          <Activity size={16} className="mr-2" />
          Performance
          <ChevronDown size={16} className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="fixed bottom-16 right-4 z-50 w-80">
        <Card className="shadow-lg border-border bg-background">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap size={16} />
              Performance Metrics
              {performanceScore && (
                <span className={`ml-auto ${getScoreColor(performanceScore.overall)}`}>
                  {performanceScore.overall}/100
                </span>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LCP:</span>
                  <span>{formatTime(metrics.largestContentfulPaint)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">FID:</span>
                  <span>{formatTime(metrics.firstInputDelay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CLS:</span>
                  <span>{metrics.cumulativeLayoutShift.toFixed(3)}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">FCP:</span>
                  <span>{formatTime(metrics.firstContentfulPaint)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TTFB:</span>
                  <span>{formatTime(metrics.timeToFirstByte)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Load:</span>
                  <span>{formatTime(metrics.pageLoadTime)}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-2">
              <div className="flex items-center gap-1 mb-1">
                <Clock size={12} />
                <span className="text-muted-foreground">API Performance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Response:</span>
                <span>{avgAPITime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recent Calls:</span>
                <span>{apiMetrics.slice(-10).length}</span>
              </div>
              {recentAPIErrors.length > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Recent Errors:</span>
                  <span>{recentAPIErrors.length}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}