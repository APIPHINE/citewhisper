
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Save, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define TypeScript types for our IIIF items
type IIIFItem = Database['public']['Tables']['iiif_manifests']['Row'];

type IIIFHost = {
  host_name: string;
  items: IIIFItem[];
};

// Load Mirador dynamically on the client side only
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

const IIIFViewer = () => {
  const [manifestUrl, setManifestUrl] = useState('');
  const [activeManifest, setActiveManifest] = useState('');
  const [isLoadingManifest, setIsLoadingManifest] = useState(false);
  const [hosts, setHosts] = useState<IIIFHost[]>([]);
  const [expandedHosts, setExpandedHosts] = useState<Record<string, boolean>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [newHostName, setNewHostName] = useState('');
  const [isAddHostDialogOpen, setIsAddHostDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load saved manifests on component mount
  useEffect(() => {
    fetchIIIFData();
  }, []);

  const fetchIIIFData = async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('iiif_manifests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Group by host name
        const groupedData: Record<string, IIIFItem[]> = {};
        data.forEach((item: IIIFItem) => {
          if (!groupedData[item.host_name]) {
            groupedData[item.host_name] = [];
          }
          groupedData[item.host_name].push(item);
        });
        
        // Convert to array of hosts
        const hostsArray: IIIFHost[] = Object.entries(groupedData).map(([hostName, items]) => ({
          host_name: hostName,
          items
        }));
        
        setHosts(hostsArray);
      }
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
    
    // When loading is complete
    setTimeout(() => {
      setIsLoadingManifest(false);
      toast({
        title: "Success",
        description: "IIIF manifest loaded successfully",
      });
    }, 1000);
  };

  const extractHostName = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      return "unknown-host";
    }
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
      const title = "Manifest from " + hostName; // Ideally we would extract a real title from the manifest
      
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
      const { error } = await supabase
        .from('iiif_manifests')
        .insert({
          host_name: hostName,
          manifest_url: activeManifest,
          title: "Manifest from " + hostName,
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "IIIF manifest saved successfully",
      });
      
      // Refresh the list
      fetchIIIFData();
      
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

  const toggleHostExpanded = (hostName: string) => {
    setExpandedHosts(prev => ({
      ...prev,
      [hostName]: !prev[hostName]
    }));
  };

  const loadSavedManifest = (url: string) => {
    setManifestUrl(url);
    setActiveManifest(url);
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
                          <Button onClick={loadManifest} disabled={isLoadingManifest}>
                            {isLoadingManifest ? "Loading..." : "Load"}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={saveManifest} 
                            disabled={!activeManifest}
                          >
                            <Save size={16} className="mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                      
                      <div className="h-full min-h-[600px] bg-background border rounded-md">
                        {activeManifest ? (
                          <MiradorViewer />
                        ) : (
                          <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                            Enter a IIIF manifest URL and click "Load" to view the content
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>IIIF Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingData ? (
                      <div className="flex justify-center py-8">Loading saved manifests...</div>
                    ) : hosts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No saved manifests yet. Load and save a manifest to get started.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {hosts.map((host) => (
                          <div key={host.host_name} className="border rounded-md overflow-hidden">
                            <div 
                              className="bg-muted p-2 flex justify-between items-center cursor-pointer"
                              onClick={() => toggleHostExpanded(host.host_name)}
                            >
                              <span className="font-medium">{host.host_name}</span>
                              <span>{expandedHosts[host.host_name] ? '▼' : '►'}</span>
                            </div>
                            
                            {expandedHosts[host.host_name] && (
                              <div className="p-2 space-y-2">
                                {host.items.map((item) => (
                                  <div 
                                    key={item.id}
                                    className="p-2 hover:bg-accent rounded cursor-pointer"
                                    onClick={() => loadSavedManifest(item.manifest_url)}
                                  >
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-muted-foreground truncate">
                                      {item.manifest_url}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Dialog open={isAddHostDialogOpen} onOpenChange={setIsAddHostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Host</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Would you like to add "{newHostName}" as a new host in the database?</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddHostDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmAddHost}>Add Host</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </>
  );
};

export default IIIFViewer;
