import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Printer, Download, Landmark } from "lucide-react";

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
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!receipt) return null;

  const now = new Date();
  const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  const handlePrint = () => {
    const content = receiptRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Receipt</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
        .logo { text-align: center; margin-bottom: 16px; font-size: 20px; font-weight: bold; }
        .check { text-align: center; color: #22c55e; font-size: 48px; margin-bottom: 8px; }
        .title { text-align: center; font-size: 18px; font-weight: 600; margin-bottom: 16px; }
        .items { background: #f5f5f5; border-radius: 8px; padding: 16px; }
        .item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .item .label { color: #666; }
        .item .value { font-weight: 500; }
        .ref { border-top: 1px solid #ddd; margin-top: 12px; padding-top: 12px; }
        .date { text-align: center; color: #999; font-size: 12px; margin-top: 16px; }
      </style></head><body>
      <div class="logo">AbanRemit</div>
      <div class="check">✓</div>
      <div class="title">${receipt.title}</div>
      <div class="items">
        ${receipt.items.map(i => `<div class="item"><span class="label">${i.label}</span><span class="value">${i.value}</span></div>`).join("")}
        <div class="ref"><div class="item"><span class="label">Reference</span><span class="value" style="font-family:monospace;font-size:12px">${receipt.reference}</span></div></div>
      </div>
      <div class="date">${dateStr}</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleSave = () => {
    const lines = [
      "AbanRemit — Transaction Receipt",
      "================================",
      receipt.title,
      "",
      ...receipt.items.map((i) => `${i.label}: ${i.value}`),
      "",
      `Reference: ${receipt.reference}`,
      `Date: ${dateStr}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${receipt.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Transaction Successful
          </DialogTitle>
        </DialogHeader>
        <div ref={receiptRef} className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">AbanRemit</span>
          </div>
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
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground text-xs">{dateStr}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={handleSave} className="flex-1">
              <Download className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex-1">
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
          </div>
          <Button onClick={onClose} className="w-full">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
