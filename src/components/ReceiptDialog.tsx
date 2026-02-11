import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export interface ReceiptData {
  title: string;
  items: { label: string; value: string }[];
  reference: string;
}

interface ReceiptDialogProps {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export function ReceiptDialog({ open, onClose, receipt }: ReceiptDialogProps) {
  if (!receipt) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Transaction Successful
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{receipt.title}</h3>
          <div className="w-full bg-muted rounded-lg p-4 space-y-3">
            {receipt.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-foreground font-medium">{item.value}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reference</span>
                <span className="text-foreground font-mono text-xs">{receipt.reference}</span>
              </div>
            </div>
          </div>
          <Button onClick={onClose} className="w-full">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
