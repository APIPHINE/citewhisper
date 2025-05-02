
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CsvPreview } from './CsvPreview';

interface DesktopPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  showPreview: () => void;
  parsedCsvData: string[][];
  csvContent: string;
}

export const DesktopPreviewDialog = ({ 
  isOpen, 
  onOpenChange,
  showPreview,
  parsedCsvData,
  csvContent 
}: DesktopPreviewDialogProps) => {
  return (
    <>
      <Button variant="outline" onClick={showPreview}>
        Preview CSV
      </Button>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>CSV Preview</DialogTitle>
            <DialogDescription>
              Preview of the converted CSV file
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh]">
            <CsvPreview parsedCsvData={parsedCsvData} csvContent={csvContent} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
