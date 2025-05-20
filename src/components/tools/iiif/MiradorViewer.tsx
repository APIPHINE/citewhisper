
import { useState, useEffect, useRef } from 'react';

const MiradorViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      import('mirador').then((Mirador) => {
        import('mirador-image-tools').then((MiradorImageTools) => {
          if (containerRef.current) {
            // Clear any existing viewers
            while (containerRef.current.firstChild) {
              containerRef.current.removeChild(containerRef.current.firstChild);
            }
            
            Mirador.default.viewer({
              id: 'mirador',
              plugins: [
                MiradorImageTools.default
              ],
              windows: [],
              theme: {
                palette: {
                  primary: {
                    main: 'rgb(var(--primary))',
                  },
                },
              },
            });
          }
        });
      });
    }

    return () => {
      // Clean up Mirador on unmount if necessary
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
    };
  }, []);

  if (!isMounted) {
    return <div className="h-96 flex items-center justify-center">Loading IIIF Viewer...</div>;
  }

  return <div ref={containerRef} id="mirador" className="h-[600px]"></div>;
};

export default MiradorViewer;
