
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ManifestForm from '@/components/tools/iiif/ManifestForm';
import CustomIIIFViewer from '@/components/tools/iiif/CustomIIIFViewer';

interface ViewerCardProps {
  manifestUrl: string;
  setManifestUrl: (url: string) => void;
  activeManifest: string;
  isLoadingManifest: boolean;
  onLoadManifest: () => void;
  onSaveManifest: () => void;
  manifestData: any;
  onManifestLoad: (data: any) => void;
}

const ViewerCard = ({ 
  manifestUrl, 
  setManifestUrl, 
  activeManifest, 
  isLoadingManifest,
  onLoadManifest,
  onSaveManifest,
  manifestData,
  onManifestLoad
}: ViewerCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manifest Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <ManifestForm 
            manifestUrl={manifestUrl}
            setManifestUrl={setManifestUrl}
            activeManifest={activeManifest}
            isLoadingManifest={isLoadingManifest}
            onLoadManifest={onLoadManifest}
            onSaveManifest={onSaveManifest}
          />
          
          <div className="h-full min-h-[600px]">
            {activeManifest ? (
              <CustomIIIFViewer 
                manifestUrl={activeManifest} 
                onManifestLoad={onManifestLoad}
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center text-muted-foreground border rounded-md bg-background">
                Enter a IIIF manifest URL and click "Load" to view the content
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewerCard;
