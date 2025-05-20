
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IIIFHost } from '@/services/iiifService';

interface ManifestDatabaseProps {
  hosts: IIIFHost[];
  isLoadingData: boolean;
  onSelectManifest: (url: string) => void;
}

const ManifestDatabase = ({ hosts, isLoadingData, onSelectManifest }: ManifestDatabaseProps) => {
  const [expandedHosts, setExpandedHosts] = useState<Record<string, boolean>>({});
  
  const toggleHostExpanded = (hostName: string) => {
    setExpandedHosts(prev => ({
      ...prev,
      [hostName]: !prev[hostName]
    }));
  };

  return (
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
                        onClick={() => onSelectManifest(item.manifest_url)}
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
  );
};

export default ManifestDatabase;
