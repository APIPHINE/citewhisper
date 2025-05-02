
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadAreaProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadArea = ({ onFileUpload }: FileUploadAreaProps) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
      <div className="flex flex-col items-center justify-center space-y-4">
        <FileText className="h-10 w-10 text-gray-400" />
        <div className="flex flex-col items-center">
          <p className="font-medium text-gray-700">Upload a Markdown file</p>
          <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
        </div>
        <input
          type="file"
          accept=".md"
          onChange={onFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Button variant="outline" className="relative z-10 pointer-events-none">
          <Upload className="mr-2" />
          Select file
        </Button>
      </div>
    </div>
  );
};
