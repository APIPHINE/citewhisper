
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchIIIFData, 
  saveIIIFManifest, 
  extractHostName,
  type IIIFHost 
} from '@/services/iiifService';

export const useIIIFManifest = () => {
  const [manifestUrl, setManifestUrl] = useState('');
  const [activeManifest, setActiveManifest] = useState('');
  const [isLoadingManifest, setIsLoadingManifest] = useState(false);
  const [hosts, setHosts] = useState<IIIFHost[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [newHostName, setNewHostName] = useState('');
  const [isAddHostDialogOpen, setIsAddHostDialogOpen] = useState(false);
  const [manifestData, setManifestData] = useState<any>(null);
  const { toast } = useToast();

  const loadIIIFData = async () => {
    setIsLoadingData(true);
    try {
      const hostsData = await fetchIIIFData();
      setHosts(hostsData);
    } catch (error) {
      console.error('Error fetching IIIF data:', error);
      toast({
        title: "Error",
        description: "Failed to load saved IIIF manifests",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadManifest = () => {
    if (!manifestUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid IIIF manifest URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingManifest(true);
    setActiveManifest(manifestUrl);
    
    // Fetch the manifest to get the title
    fetch(manifestUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setManifestData(data);
        setIsLoadingManifest(false);
        toast({
          title: "Success",
          description: "IIIF manifest loaded successfully",
        });
      })
      .catch(err => {
        console.error('Error loading manifest:', err);
        setIsLoadingManifest(false);
        toast({
          title: "Error",
          description: `Failed to load manifest: ${err.message}`,
          variant: "destructive"
        });
      });
  };

  const saveManifest = async () => {
    if (!activeManifest) {
      toast({
        title: "Error",
        description: "Please load a manifest first before saving",
        variant: "destructive"
      });
      return;
    }

    try {
      const hostName = extractHostName(activeManifest);
      
      // Check if this host already exists in our database
      const hostExists = hosts.some(host => host.host_name === hostName);
      
      if (!hostExists) {
        // Prompt to add new host
        setNewHostName(hostName);
        setIsAddHostDialogOpen(true);
        return;
      }
      
      // If host exists, save directly
      await saveManifestToDatabase(hostName);
      
    } catch (error) {
      console.error('Error saving manifest:', error);
      toast({
        title: "Error",
        description: "Failed to save IIIF manifest",
        variant: "destructive"
      });
    }
  };
  
  const saveManifestToDatabase = async (hostName: string) => {
    try {
      // Extract a human-readable title from the manifest data if available
      let title = "Manifest from " + hostName;
      
      if (manifestData) {
        // Try to get title from manifest (handling both v2 and v3 formats)
        if (manifestData.label) {
          if (typeof manifestData.label === 'string') {
            title = manifestData.label;
          } else if (manifestData.label.en) {
            // v3 format with language map
            title = Array.isArray(manifestData.label.en) 
              ? manifestData.label.en[0] 
              : manifestData.label.en;
          } else if (manifestData.label['@value']) {
            // Some v2 format
            title = manifestData.label['@value'];
          } else if (Array.isArray(manifestData.label) && manifestData.label.length > 0) {
            // Array format
            const firstLabel = manifestData.label[0];
            title = firstLabel['@value'] || firstLabel.value || String(firstLabel);
          }
        }
      }
      
      await saveIIIFManifest(hostName, activeManifest, title);
      
      toast({
        title: "Success",
        description: "IIIF manifest saved successfully",
      });
      
      // Refresh the list
      loadIIIFData();
      
    } catch (error) {
      console.error('Error saving to database:', error);
      toast({
        title: "Error",
        description: "Failed to save IIIF manifest to database",
        variant: "destructive"
      });
    }
  };

  const loadSavedManifest = (url: string) => {
    setManifestUrl(url);
    setActiveManifest(url);
    
    // Fetch the manifest to get its data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setManifestData(data);
      })
      .catch(err => {
        console.error('Error loading saved manifest data:', err);
      });
  };

  return {
    manifestUrl,
    setManifestUrl,
    activeManifest,
    setActiveManifest,
    isLoadingManifest,
    setIsLoadingManifest,
    hosts,
    setHosts,
    isLoadingData,
    setIsLoadingData,
    newHostName,
    setNewHostName,
    isAddHostDialogOpen,
    setIsAddHostDialogOpen,
    manifestData,
    setManifestData,
    loadIIIFData,
    loadManifest,
    saveManifest,
    saveManifestToDatabase,
    loadSavedManifest,
  };
};
