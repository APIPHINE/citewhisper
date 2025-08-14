import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface APIPerformance {
  endpoint: string;
  duration: number;
  timestamp: number;
  success: boolean;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [apiMetrics, setApiMetrics] = useState<APIPerformance[]>([]);
  const observerRef = useRef<PerformanceObserver>();

  // Monitor Core Web Vitals
  const monitorWebVitals = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({
            ...prev!,
            pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            timeToFirstByte: navEntry.responseStart - navEntry.requestStart,
          }));
        }
        
        if (entry.entryType === 'paint') {
          const paintEntry = entry as PerformancePaintTiming;
          if (paintEntry.name === 'first-contentful-paint') {
            setMetrics(prev => ({
              ...prev!,
              firstContentfulPaint: paintEntry.startTime,
            }));
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          const lcpEntry = entry as PerformanceEntry;
          setMetrics(prev => ({
            ...prev!,
            largestContentfulPaint: lcpEntry.startTime,
          }));
        }
        
        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            setMetrics(prev => ({
              ...prev!,
              cumulativeLayoutShift: (prev?.cumulativeLayoutShift || 0) + clsEntry.value,
            }));
          }
        }
        
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          setMetrics(prev => ({
            ...prev!,
            firstInputDelay: fidEntry.processingStart - fidEntry.startTime,
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  // Track API performance
  const trackAPICall = useCallback((endpoint: string, duration: number, success: boolean) => {
    setApiMetrics(prev => [
      ...prev.slice(-49), // Keep last 50 entries
      {
        endpoint,
        duration,
        timestamp: Date.now(),
        success,
      }
    ]);
  }, []);

  // Initialize metrics
  useEffect(() => {
    setMetrics({
      pageLoadTime: 0,
      timeToFirstByte: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    });

    const cleanup = monitorWebVitals();
    return cleanup;
  }, [monitorWebVitals]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Calculate performance scores
  const getPerformanceScore = useCallback(() => {
    if (!metrics) return null;

    const scores = {
      lcp: metrics.largestContentfulPaint <= 2500 ? 100 : metrics.largestContentfulPaint <= 4000 ? 50 : 0,
      fid: metrics.firstInputDelay <= 100 ? 100 : metrics.firstInputDelay <= 300 ? 50 : 0,
      cls: metrics.cumulativeLayoutShift <= 0.1 ? 100 : metrics.cumulativeLayoutShift <= 0.25 ? 50 : 0,
    };

    return {
      overall: Math.round((scores.lcp + scores.fid + scores.cls) / 3),
      individual: scores,
    };
  }, [metrics]);

  return {
    metrics,
    apiMetrics,
    trackAPICall,
    getPerformanceScore,
  };
};