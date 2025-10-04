import React, { useState, useCallback } from 'react';
import { FileUploadArea } from '@/components/ui/file-upload-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Eye, EyeOff, Wand2, Camera, Upload } from 'lucide-react';
import { processImageWithAI, ProcessedEvidence } from '@/utils/aiOcrProcessor';
import { cn } from '@/lib/utils';

interface SmartImageUploadProps {
  onEvidenceProcessed: (evidence: ProcessedEvidence, originalFile: File) => void;
  onFilesSelected: (files: File[]) => void;
  selectedFiles?: File[];
  className?: string;
}

export function SmartImageUpload({ 
  onEvidenceProcessed, 
  onFilesSelected, 
  selectedFiles = [],
  className 
}: SmartImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedEvidence, setProcessedEvidence] = useState<ProcessedEvidence | null>(null);
  const [showProcessedImage, setShowProcessedImage] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    onFilesSelected(files);
    
    if (files.length > 0) {
      setIsProcessing(true);
      setProgress(10);
      let timer: number | undefined;
      try {
        // Smooth progress animation up to 90%
        timer = window.setInterval(() => {
          setProgress((p) => Math.min(90, p + 5));
        }, 300);

        console.log('Processing evidence image...');
        const evidence = await processImageWithAI(files[0], (p) => {
          setProgress(p);
        });
        setProcessedEvidence(evidence);
        setProgress(95);
        onEvidenceProcessed(evidence, files[0]);
      } catch (error) {
        console.error('Error processing evidence:', error);
      } finally {
        if (timer) window.clearInterval(timer);
        setProgress(100);
        setTimeout(() => setProgress(0), 800);
        setIsProcessing(false);
      }
    }
  }, [onEvidenceProcessed, onFilesSelected]);

  const confidenceColor = processedEvidence ? 
    processedEvidence.confidence >= 0.7 ? 'bg-green-500' :
    processedEvidence.confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
    : 'bg-gray-500';

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Evidence Image
            <Badge variant="secondary" className="ml-auto">
              Step 1
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload an image of your source material. We'll automatically extract text and enhance the image.
          </p>
        </CardHeader>
        <CardContent>
          {selectedFiles.length === 0 ? (
            <FileUploadArea
              onFilesSelected={handleFilesSelected}
              maxFiles={1}
              acceptedFileTypes={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
              maxSizeMB={5}
              selectedFiles={selectedFiles}
            />
          ) : (
            <div className="space-y-4">
              {/* Original Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Original Image</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onFilesSelected([])}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Different Image
                  </Button>
                </div>
                <div className="relative">
                  <img
                    src={URL.createObjectURL(selectedFiles[0])}
                    alt="Evidence"
                    className="max-w-full h-auto rounded-md border max-h-64 object-contain"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-md gap-3 p-4">
                      <div className="bg-white p-4 rounded-lg flex items-center gap-2 shadow">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processing image...</span>
                      </div>
                      <div className="w-3/4 max-w-md">
                        <Progress value={progress} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Processing Results */}
              {processedEvidence && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Wand2 className="h-4 w-4" />
                      AI Processing Results
                    </h4>
                    <Badge className={confidenceColor}>
                      {Math.round(processedEvidence.confidence * 100)}% confidence
                    </Badge>
                  </div>

                  {/* Extracted Text */}
                  {processedEvidence.text && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Extracted Text:</label>
                      <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                        {processedEvidence.text}
                      </div>
                    </div>
                  )}

                  {/* Parsed Components */}
                  {(processedEvidence.author || processedEvidence.title || processedEvidence.context) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {processedEvidence.author && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Detected Author:</label>
                          <div className="p-2 bg-primary/10 rounded text-sm">{processedEvidence.author}</div>
                        </div>
                      )}
                      {processedEvidence.title && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Detected Title:</label>
                          <div className="p-2 bg-primary/10 rounded text-sm">{processedEvidence.title}</div>
                        </div>
                      )}
                      {processedEvidence.context && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Detected Context:</label>
                          <div className="p-2 bg-primary/10 rounded text-sm">{processedEvidence.context}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}