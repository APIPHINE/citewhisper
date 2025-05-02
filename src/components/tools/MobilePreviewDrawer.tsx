
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { CsvPreview } from './CsvPreview';

interface MobilePreviewDrawerProps {
  parsedCsvData: string[][];
  csvContent: string;
}

export const MobilePreviewDrawer = ({ parsedCsvData, csvContent }: MobilePreviewDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Preview CSV</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>CSV Preview</DrawerTitle>
          <DrawerDescription>
            Preview of the converted CSV file
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-x-auto">
          <CsvPreview parsedCsvData={parsedCsvData} csvContent={csvContent} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
