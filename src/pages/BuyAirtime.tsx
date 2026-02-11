import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PINDialog } from "@/components/PINDialog";
import { ReceiptDialog, ReceiptData } from "@/components/ReceiptDialog";
import { ConfirmDialog, ConfirmInfo } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { generateTransactionId } from "@/lib/demo-data";

const AIRTIME_PRESETS = [50, 100, 200, 500, 1000];

export default function BuyAirtime() {
  const { user, processTransaction } = useAuth();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  if (!user) return null;
  const val = parseFloat(amount || "0");

  const handleBuy = () => {
    if (!val || val <= 0) { toast.error("Select or enter an amount"); return; }
    if (val > user.balance) { toast.error("Insufficient balance"); return; }
    if (!phone) { toast.error("Enter phone number"); return; }
    setShowConfirm(true);
  };

  const confirmInfo: ConfirmInfo = {
    title: "Confirm Airtime Purchase",
    details: [
      { label: "Phone Number", value: phone },
      { label: "Amount", value: `KES ${val.toLocaleString()}` },
      { label: "Source", value: `Wallet (${user.walletId})` },
    ],
  };

  const handleConfirmed = () => {
    setShowConfirm(false);
    setShowPIN(true);
  };

  const handlePINVerified = () => {
    setShowPIN(false);
    const ref = generateTransactionId();
    processTransaction({
      type: "airtime",
      amount: val,
      fee: 0,
      reference: ref,
    });
    setReceipt({
      title: `KES ${val.toLocaleString()} Airtime`,
      items: [
        { label: "Phone Number", value: phone },
        { label: "Amount", value: `KES ${val.toLocaleString()}` },
        { label: "Status", value: "Successful" },
      ],
      reference: ref,
    });
    setAmount("");
  };

  return (
    <DashboardLayout title="Buy Airtime">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Buy Airtime</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Balance: <span className="font-bold text-foreground">KES {user.balance.toLocaleString()}</span>
          </p>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Amount (KES)</Label>
              <Input type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-center text-lg" />
              <div className="flex gap-2 mt-3 flex-wrap">
                {AIRTIME_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(String(p))}
                    className={cn(
                      "py-2 px-4 rounded-lg border text-sm font-medium transition-colors",
                      amount === String(p)
                        ? "border-primary text-primary bg-accent"
                        : "border-border text-foreground hover:bg-muted"
                    )}
                  >
                    {p.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleBuy} disabled={!amount} className="w-full">
              Buy Airtime
            </Button>
          </div>
        </div>

        <ConfirmDialog open={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={handleConfirmed} info={confirmInfo} />
        <PINDialog open={showPIN} onClose={() => setShowPIN(false)} onVerified={handlePINVerified} />
        <ReceiptDialog open={!!receipt} onClose={() => setReceipt(null)} receipt={receipt} />
      </div>
    </DashboardLayout>
  );
}
