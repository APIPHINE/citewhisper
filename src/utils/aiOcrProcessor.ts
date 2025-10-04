import { supabase } from "@/integrations/supabase/client";

export interface ProcessedEvidence {
  text: string;
  author?: string;
  title?: string;
  context?: string;
  confidence: number;
}

export const processImageWithAI = async (
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<ProcessedEvidence> => {
  try {
    console.log('Starting AI OCR processing...');
    onProgress?.(10);

    // Convert image to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const imageData = await base64Promise;
    onProgress?.(30);
    
    console.log('Image converted to base64, calling edge function...');

    // Call the edge function
    const { data, error } = await supabase.functions.invoke('process-evidence-image', {
      body: { imageData }
    });

    onProgress?.(90);

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to process image');
    }

    if (!data) {
      throw new Error('No data returned from processing');
    }

    console.log('OCR result:', data);
    onProgress?.(100);

    return {
      text: data.text || '',
      author: data.author,
      title: data.title,
      context: data.context,
      confidence: data.confidence || 0
    };
  } catch (error) {
    console.error('Error processing image with AI:', error);
    throw error;
  }
};
