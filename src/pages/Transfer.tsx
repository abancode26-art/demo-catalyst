import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OTPDialog } from "@/components/OTPDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { calculateFee } from "@/lib/demo-data";

export default function Transfer() {
  const { user, transfer } = useAuth();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!user) return null;

  const val = parseFloat(amount || "0");
  const fee = val > 0 ? calculateFee(val, "transfer") : 0;

  const handleTransfer = () => {
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    if (!recipient) { toast.error("Enter recipient phone number"); return; }
    if (val + fee > user.balance) { toast.error("Insufficient balance"); return; }
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setProcessing(true);
    setTimeout(() => {
      transfer(val, recipient);
      setProcessing(false);
      setAmount("");
      setRecipient("");
    }, 2000);
  };

  return (
    <DashboardLayout title="Transfer Funds">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Wallet to Wallet Transfer</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Available balance: <span className="font-bold text-foreground">KES {user.balance.toLocaleString()}</span>
          </p>

          <div className="space-y-5">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Recipient Phone</Label>
              <Input placeholder="07XXXXXXXX" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Amount (KES)</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-center text-lg" />
            </div>
            {val > 0 && (
              <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-foreground font-medium">KES {val.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="text-foreground font-medium">KES {fee.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">KES {(val + fee).toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button onClick={handleTransfer} disabled={processing} className="w-full">
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {processing ? "Processing..." : "Send Money"}
            </Button>
          </div>
        </div>
        <OTPDialog open={showOTP} onClose={() => setShowOTP(false)} onVerified={handleOTPVerified} phone={user.phone} />
      </div>
    </DashboardLayout>
  );
}
