
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const MiradorViewer = ({ manifestUrl }: { manifestUrl?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      setIsLoading(true);
      setError(null);
      
      // Load Mirador
      import('mirador')
        .then((Mirador) => {
          if (containerRef.current) {
            // Clear any existing viewers
            while (containerRef.current.firstChild) {
              containerRef.current.removeChild(containerRef.current.firstChild);
            }
            
            const config: any = {
              id: 'mirador',
              windows: manifestUrl ? [{ manifestId: manifestUrl }] : [],
              theme: {
                palette: {
                  primary: {
                    main: 'rgb(var(--primary))',
                  },
                },
              },
            };
            
            try {
              Mirador.default.viewer(config);
              setIsLoading(false);
            } catch (err) {
              console.error('Error initializing Mirador:', err);
              setError('Failed to initialize IIIF viewer');
              setIsLoading(false);
            }
          }
        })
        .catch((err) => {
          console.error('Error loading Mirador:', err);
          setError('Failed to load IIIF viewer library');
          setIsLoading(false);
        });
    }

    return () => {
      // Clean up Mirador on unmount
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, [manifestUrl]);

  if (!isMounted) {
    return <div className="h-96 flex items-center justify-center">Loading IIIF Viewer...</div>;
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center flex-col gap-2 text-destructive">
        <p>{error}</p>
        <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div ref={containerRef} id="mirador" className="h-full"></div>
    </div>
  );
};

export default MiradorViewer;
