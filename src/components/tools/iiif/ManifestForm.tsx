
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManifestFormProps {
  onLoadManifest: (url: string) => void;
  onSaveManifest: () => void;
  manifestUrl: string;
  setManifestUrl: (url: string) => void;
  activeManifest: string;
  isLoadingManifest: boolean;
}

const ManifestForm = ({ 
  onLoadManifest, 
  onSaveManifest, 
  manifestUrl, 
  setManifestUrl, 
  activeManifest,
  isLoadingManifest
}: ManifestFormProps) => {
  const { toast } = useToast();
  
  const handleLoad = () => {
    if (!manifestUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid IIIF manifest URL",
        variant: "destructive"
      });
      return;
    }
    onLoadManifest(manifestUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="manifest-url">IIIF Manifest URL</Label>
      <div className="flex gap-2">
        <Input 
          id="manifest-url"
          value={manifestUrl}
          onChange={(e) => setManifestUrl(e.target.value)}
          placeholder="https://example.org/iiif/manifest.json"
          className="flex-1"
        />
        <Button onClick={handleLoad} disabled={isLoadingManifest}>
          {isLoadingManifest ? "Loading..." : "Load"}
        </Button>
        <Button 
          variant="outline" 
          onClick={onSaveManifest} 
          disabled={!activeManifest}
        >
          <Save size={16} className="mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default ManifestForm;
