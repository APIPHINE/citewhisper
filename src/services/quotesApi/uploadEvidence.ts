
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an evidence image to the storage bucket with attribution metadata
 * 
 * @param file - The file to upload
 * @param attributionMetadata - Metadata for attribution and fair use
 * @returns The public URL of the uploaded file or null if failed
 */
export async function uploadEvidenceImage(
  file: File, 
  attributionMetadata: Record<string, any>
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading file to quote_evidence bucket:', filePath);
    
    const { error: uploadError, data } = await supabase.storage
      .from('quote_evidence')
      .upload(filePath, file, {
        metadata: attributionMetadata,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Error uploading evidence image:', uploadError);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('quote_evidence')
      .getPublicUrl(filePath);

    console.log('File uploaded successfully, public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadEvidenceImage:', error);
    return null;
  }
}
