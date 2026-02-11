import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmInfo {
  title: string;
  details: { label: string; value: string }[];
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  info: ConfirmInfo | null;
}

export function ConfirmDialog({ open, onClose, onConfirm, info }: ConfirmDialogProps) {
  if (!info) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{info.title}</DialogTitle>
          <DialogDescription>Please verify the details below before confirming.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            {info.details.map((d, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="text-foreground font-medium">{d.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={onConfirm} className="flex-1">Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
