
import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FileUploadAreaProps = {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: Record<string, string[]>;
  maxSizeMB?: number;
  selectedFiles?: File[];
  className?: string;
};

export function FileUploadArea({
  onFilesSelected,
  maxFiles = 1,
  acceptedFileTypes,
  maxSizeMB = 5,
  selectedFiles = [],
  className,
}: FileUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_BYTES = maxSizeMB * 1024 * 1024;

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const validateFiles = useCallback((files: FileList | File[]): File[] => {
    setError(null);
    const validatedFiles: File[] = [];

    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'}`);
      return Array.from(files).slice(0, maxFiles);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_SIZE_BYTES) {
        setError(`File "${file.name}" exceeds the maximum size of ${maxSizeMB}MB`);
        continue;
      }

      if (acceptedFileTypes) {
        const fileType = file.type;
        let isAccepted = false;

        Object.entries(acceptedFileTypes).forEach(([type, extensions]) => {
          // Check MIME type matches
          if (fileType.match(new RegExp(type.replace('*', '.*')))) {
            isAccepted = true;
          }

          // Check extension matches
          const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
          if (extensions.includes(extension)) {
            isAccepted = true;
          }
        });

        if (!isAccepted) {
          setError(`File "${file.name}" is not an accepted file type`);
          continue;
        }
      }

      validatedFiles.push(file);
    }

    return validatedFiles;
  }, [acceptedFileTypes, maxFiles, MAX_SIZE_BYTES, maxSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = validateFiles(e.dataTransfer.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  }, [onFilesSelected, validateFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  }, [onFilesSelected, validateFiles]);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (file: File) => {
    onFilesSelected(selectedFiles.filter(f => f !== file));
  };

  const acceptedTypesForInput = acceptedFileTypes
    ? Object.entries(acceptedFileTypes)
      .map(([type, extensions]) => extensions.join(','))
      .join(',')
    : undefined;

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors text-center relative",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={maxFiles > 1}
          accept={acceptedTypesForInput}
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={cn(
            "p-3 rounded-full bg-secondary/50",
            dragActive && "bg-primary/20"
          )}>
            <UploadCloud className={cn(
              "h-8 w-8",
              dragActive ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium">
              {dragActive ? "Drop to upload" : "Drag and drop files here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse your device
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
          >
            Select Files
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
          </p>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary/20 p-2 rounded-md">
                <div className="flex items-center space-x-2 truncate">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => removeFile(file)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
