
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, MaximizeIcon, MinimizeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomIIIFViewerProps {
  manifestUrl?: string;
}

const CustomIIIFViewer = ({ manifestUrl }: CustomIIIFViewerProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manifest, setManifest] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!manifestUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetch(manifestUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Manifest loaded:', data);
        setManifest(data);

        // IIIF Presentation API v2 and v3 handling
        if (data.sequences) {
          // v2
          const firstSequence = data.sequences[0];
          const firstCanvas = firstSequence.canvases[0];
          const firstImage = firstCanvas.images[0];
          const imageServiceUrl = firstImage.resource.service['@id'] || firstImage.resource.service.id;
          setImageUrl(`${imageServiceUrl}/full/800,/0/default.jpg`);
        } else if (data.items) {
          // v3
          const firstCanvas = data.items[0];
          const firstAnnotationPage = firstCanvas.items?.[0] || firstCanvas.annotations?.[0];
          if (firstAnnotationPage && firstAnnotationPage.items) {
            const firstAnnotation = firstAnnotationPage.items[0];
            const imageServiceUrl = firstAnnotation.body.service[0]['@id'] || firstAnnotation.body.service[0].id;
            setImageUrl(`${imageServiceUrl}/full/800,/0/default.jpg`);
          }
        }
        
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading manifest:', err);
        setError(`Failed to load IIIF manifest: ${err.message}`);
        setIsLoading(false);
      });
  }, [manifestUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setError('Failed to load image from manifest');
    setIsLoading(false);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const rotateClockwise = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
  };

  const toggleFullscreen = () => {
    if (!canvasRef.current) return;
    
    if (!fullscreen) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };

  // Navigation between images in a multi-image manifest
  const navigateToPrevious = () => {
    if (manifest) {
      if (manifest.sequences && currentImageIndex > 0) {
        setCurrentImageIndex(prev => {
          const newIndex = prev - 1;
          const canvas = manifest.sequences[0].canvases[newIndex];
          const image = canvas.images[0];
          const imageServiceUrl = image.resource.service['@id'] || image.resource.service.id;
          setImageUrl(`${imageServiceUrl}/full/800,/0/default.jpg`);
          return newIndex;
        });
      } else if (manifest.items && currentImageIndex > 0) {
        setCurrentImageIndex(prev => {
          const newIndex = prev - 1;
          const canvas = manifest.items[newIndex];
          const firstAnnotationPage = canvas.items?.[0] || canvas.annotations?.[0];
          if (firstAnnotationPage && firstAnnotationPage.items) {
            const firstAnnotation = firstAnnotationPage.items[0];
            const imageServiceUrl = firstAnnotation.body.service[0]['@id'] || firstAnnotation.body.service[0].id;
            setImageUrl(`${imageServiceUrl}/full/800,/0/default.jpg`);
          }
          return newIndex;
        });
      }
    }
  };

  const navigateToNext = () => {
    if (manifest) {
      const maxIndex = manifest.sequences 
        ? manifest.sequences[0].canvases.length - 1
        : manifest.items 
          ? manifest.items.length - 1
          : 0;
          
      if (currentImageIndex < maxIndex) {
        setCurrentImageIndex(prev => {
          const newIndex = prev + 1;
          
          if (manifest.sequences) {
            const canvas = manifest.sequences[0].canvases[newIndex];
            const image = canvas.images[0];
            const imageServiceUrl = image.resource.service['@id'] || image.resource.service.id;
            setImageUrl(`${imageServiceUrl}/full/800,/0/default.jpg`);
          } else if (manifest.items) {
            const canvas = manifest.items[newIndex];
            const firstAnnotationPage = canvas.items?.[0] || canvas.annotations?.[0];
            if (firstAnnotationPage && firstAnnotationPage.items) {
              const firstAnnotation = firstAnnotationPage.items[0];
              const imageServiceUrl = firstAnnotation.body.service[0]['@id'] || firstAnnotation.body.service[0].id;
              setImageUrl(`${imageServiceUrl}/full/800,/0/default.jpg`);
            }
          }
          
          return newIndex;
        });
      }
    }
  };

  const hasMultipleImages = manifest && ((manifest.sequences && manifest.sequences[0].canvases.length > 1) || 
                           (manifest.items && manifest.items.length > 1));

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center flex-col gap-2 text-destructive">
        <p>{error}</p>
        <p className="text-sm text-muted-foreground">Please check the manifest URL and try again</p>
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef}
      className="relative h-[600px] bg-background border rounded-md flex flex-col"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Main viewer area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <div 
            className="relative overflow-auto h-full w-full flex items-center justify-center"
            style={{ 
              transformOrigin: 'center center',
            }}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={manifest?.label || "IIIF Image"}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="max-w-full max-h-full object-contain transition-transform"
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease-in-out'
              }}
            />
          </div>
        ) : !isLoading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image available. Please check the manifest format.
          </div>
        ) : null}
      </div>
      
      {/* Controls toolbar */}
      <div className="p-2 border-t bg-muted/30 flex items-center justify-between">
        {/* Navigation controls */}
        <div className="flex gap-2">
          {hasMultipleImages && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={navigateToPrevious}
                disabled={currentImageIndex === 0}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={navigateToNext}
                disabled={currentImageIndex === (manifest.sequences 
                  ? manifest.sequences[0].canvases.length - 1 
                  : manifest.items 
                    ? manifest.items.length - 1 
                    : 0)}
              >
                Next
              </Button>
              <span className="text-sm flex items-center px-2">
                {currentImageIndex + 1} / {manifest?.sequences 
                  ? manifest.sequences[0].canvases.length 
                  : manifest?.items 
                    ? manifest.items.length 
                    : 1}
              </span>
            </>
          )}
        </div>
        
        {/* Image manipulation controls */}
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={zoomOut} title="Zoom Out">
            <ZoomOut size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={zoomIn} title="Zoom In">
            <ZoomIn size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={rotateCounterClockwise} title="Rotate Left">
            <RotateCcw size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={rotateClockwise} title="Rotate Right">
            <RotateCw size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} title="Toggle Fullscreen">
            {fullscreen ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomIIIFViewer;
