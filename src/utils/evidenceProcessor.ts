import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

export interface ProcessedEvidence {
  extractedText?: string;
  author?: string;
  title?: string;
  context?: string;
  confidence: number;
  processedImageBlob?: Blob;
}

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width > height) {
      height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
      width = MAX_IMAGE_DIMENSION;
    } else {
      width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
      height = MAX_IMAGE_DIMENSION;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    return true;
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  return false;
}

export const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const extractTextFromImage = async (imageFile: File): Promise<ProcessedEvidence> => {
  try {
    console.log('Starting OCR process...');
    
    // Load OCR pipeline
    const recognizer = await pipeline('image-to-text', 'Xenova/trocr-base-printed', {
      device: 'webgpu',
    });

    // Process the image
    const result = await recognizer(URL.createObjectURL(imageFile));
    const extractedText = Array.isArray(result) ? 
      (result[0] as any)?.generated_text || '' : 
      (result as any)?.generated_text || '';
    
    console.log('Extracted text:', extractedText);

    // Parse extracted text for quote components
    const parsed = parseExtractedText(extractedText);
    
    // Remove background for cleaner display
    let processedImageBlob: Blob | undefined;
    try {
      const imageElement = await loadImage(imageFile);
      processedImageBlob = await removeBackground(imageElement);
    } catch (error) {
      console.warn('Background removal failed, using original image:', error);
    }

    return {
      extractedText,
      ...parsed,
      processedImageBlob,
      confidence: calculateConfidence(extractedText)
    };
  } catch (error) {
    console.error('Error in OCR processing:', error);
    return {
      extractedText: '',
      confidence: 0
    };
  }
};

function parseExtractedText(text: string): Partial<ProcessedEvidence> {
  if (!text || text.length < 10) {
    return {};
  }

  // Simple heuristics to extract quote components
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  let author: string | undefined;
  let title: string | undefined;
  let context: string | undefined;

  // Look for common author patterns
  const authorPatterns = [
    /^[-–—]\s*(.+)$/,  // Dash followed by name
    /^by\s+(.+)$/i,    // "by Author Name"
    /^(.+)\s+said$/i,  // "Author said"
  ];

  // Look for title patterns  
  const titlePatterns = [
    /^"(.+)"$/,        // Quoted titles
    /^(.+)\s+\(\d{4}\)$/,  // Title (year)
  ];

  for (const line of lines) {
    // Check for author patterns
    for (const pattern of authorPatterns) {
      const match = line.match(pattern);
      if (match && !author) {
        author = match[1].trim();
        break;
      }
    }

    // Check for title patterns
    for (const pattern of titlePatterns) {
      const match = line.match(pattern);
      if (match && !title) {
        title = match[1].trim();
        break;
      }
    }
  }

  // Extract context (remaining lines that aren't author or title)
  const contextLines = lines.filter(line => {
    if (author && line.includes(author)) return false;
    if (title && line.includes(title)) return false;
    return true;
  });

  context = contextLines.join(' ').trim() || undefined;

  return { author, title, context };
}

function calculateConfidence(text: string): number {
  if (!text) return 0;
  
  // Simple confidence scoring based on text characteristics
  let score = 0;
  
  // Length bonus (longer text usually means better OCR)
  if (text.length > 50) score += 0.3;
  if (text.length > 100) score += 0.2;
  
  // Punctuation and structure bonus
  if (text.includes('.') || text.includes('!') || text.includes('?')) score += 0.2;
  if (text.includes('"') || text.includes("'")) score += 0.1;
  
  // Word count bonus
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 5) score += 0.1;
  if (wordCount > 10) score += 0.1;
  
  return Math.min(score, 1.0);
}
