
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type IIIFItem = Database['public']['Tables']['iiif_manifests']['Row'];

export type IIIFHost = {
  host_name: string;
  items: IIIFItem[];
};

export const fetchIIIFData = async (): Promise<IIIFHost[]> => {
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
      
      return hostsArray;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching IIIF data:', error);
    throw error;
  }
};

export const saveIIIFManifest = async (
  hostName: string, 
  manifestUrl: string, 
  title: string = "Manifest from " + hostName
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('iiif_manifests')
      .insert({
        host_name: hostName,
        manifest_url: manifestUrl,
        title: title,
      });
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving to database:', error);
    throw error;
  }
};

export const extractHostName = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (e) {
    return "unknown-host";
  }
};
