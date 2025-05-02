
import { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { SectionBox } from '@/components/quote/SectionBox';
import { FileUploadArea } from './FileUploadArea';
import { MobilePreviewDrawer } from './MobilePreviewDrawer';
import { DesktopPreviewDialog } from './DesktopPreviewDialog';
import { convertMarkdownToCSV } from '@/utils/markdownConverter';

export const MarkdownToCsvConverter = () => {
  const [mdContent, setMdContent] = useState<string>('');
  const [csvContent, setCsvContent] = useState<string>('');
  const [parsedCsvData, setParsedCsvData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.md')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Markdown (.md) file",
        variant: "destructive"
      });
      return;
    }
    
    setFileName(file.name.replace('.md', ''));
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMdContent(content);
      
      // Convert markdown to CSV
      try {
        const { csv, parsedData } = convertMarkdownToCSV(content);
        setCsvContent(csv);
        setParsedCsvData(parsedData);
        toast({
          title: "File converted successfully",
          description: "Your Markdown file has been converted to CSV",
        });
      } catch (error) {
        toast({
          title: "Conversion failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const downloadCSV = () => {
    if (!csvContent) {
      toast({
        title: "No content to download",
        description: "Please upload and convert a Markdown file first",
        variant: "destructive"
      });
      return;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName || 'converted'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `${fileName || 'converted'}.csv is being downloaded`
    });
  };
  
  const showPreview = () => {
    if (!csvContent) {
      toast({
        title: "No content to preview",
        description: "Please upload and convert a Markdown file first",
        variant: "destructive"
      });
      return;
    }
    
    setIsDialogOpen(true);
  };

  return (
    <SectionBox 
      title="Convert Markdown to CSV" 
      icon={<FileSpreadsheet size={18} />}
    >
      <div className="space-y-6">
        <FileUploadArea onFileUpload={handleFileUpload} />
        
        {csvContent && (
          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadCSV}>
              <Download className="mr-2" />
              Download CSV
            </Button>
            
            {isMobile ? (
              <MobilePreviewDrawer 
                parsedCsvData={parsedCsvData} 
                csvContent={csvContent} 
              />
            ) : (
              <DesktopPreviewDialog 
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                showPreview={showPreview}
                parsedCsvData={parsedCsvData}
                csvContent={csvContent}
              />
            )}
          </div>
        )}
      </div>
    </SectionBox>
  );
};
