
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import CustomIIIFViewer from '@/components/tools/iiif/CustomIIIFViewer';
import ManifestForm from '@/components/tools/iiif/ManifestForm';
import ManifestDatabase from '@/components/tools/iiif/ManifestDatabase';
import AddHostDialog from '@/components/tools/iiif/AddHostDialog';
import { 
  fetchIIIFData, 
  saveIIIFManifest, 
  extractHostName,
  type IIIFHost 
} from '@/services/iiifService';

const IIIFViewer = () => {
  const [manifestUrl, setManifestUrl] = useState('');
  const [activeManifest, setActiveManifest] = useState('');
  const [isLoadingManifest, setIsLoadingManifest] = useState(false);
  const [hosts, setHosts] = useState<IIIFHost[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [newHostName, setNewHostName] = useState('');
  const [isAddHostDialogOpen, setIsAddHostDialogOpen] = useState(false);
  const [manifestData, setManifestData] = useState<any>(null);
  const { toast } = useToast();

  // Load saved manifests on component mount
  useEffect(() => {
    loadIIIFData();
  }, []);

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

  const confirmAddHost = async () => {
    await saveManifestToDatabase(newHostName);
    setIsAddHostDialogOpen(false);
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

  return (
    <>
      <div className="min-h-screen pb-20 pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              IIIF Viewer
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
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
                        onLoadManifest={loadManifest}
                        onSaveManifest={saveManifest}
                      />
                      
                      <div className="h-full min-h-[600px]">
                        {activeManifest ? (
                          <CustomIIIFViewer 
                            manifestUrl={activeManifest} 
                            onManifestLoad={(data) => setManifestData(data)} 
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
              </div>
              
              <div>
                <ManifestDatabase 
                  hosts={hosts}
                  isLoadingData={isLoadingData}
                  onSelectManifest={loadSavedManifest}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <AddHostDialog 
        isOpen={isAddHostDialogOpen}
        onOpenChange={setIsAddHostDialogOpen}
        hostName={newHostName}
        onConfirm={confirmAddHost}
      />
      
      <Footer />
    </>
  );
};

export default IIIFViewer;
