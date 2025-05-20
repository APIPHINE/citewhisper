
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AddHostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hostName: string;
  onConfirm: () => void;
}

const AddHostDialog = ({ isOpen, onOpenChange, hostName, onConfirm }: AddHostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Host</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Would you like to add "{hostName}" as a new host in the database?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}>Add Host</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHostDialog;
