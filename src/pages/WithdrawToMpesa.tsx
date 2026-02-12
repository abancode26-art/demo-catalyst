import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PINDialog } from "@/components/PINDialog";
import { ReceiptDialog, ReceiptData } from "@/components/ReceiptDialog";
import { ConfirmDialog, ConfirmInfo } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { calculateFee, generateTransactionId } from "@/lib/demo-data";

export default function WithdrawToMpesa() {
  const { user, processTransaction } = useAuth();
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  if (!user) return null;

  const val = parseFloat(amount || "0");
  const fee = val > 0 ? calculateFee(val, "withdrawal") : 0;

  const handleWithdraw = () => {
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    if (val + fee > user.balance) { toast.error("Insufficient balance"); return; }
    setShowConfirm(true);
  };

  const confirmInfo: ConfirmInfo = {
    title: "Confirm M-Pesa Withdrawal",
    details: [
      { label: "M-Pesa Name", value: user.name },
      { label: "Phone Number", value: user.phone },
      { label: "Wallet Number", value: user.walletId },
      { label: "Amount", value: `${user.currency} ${val.toLocaleString()}` },
      { label: "Fee", value: `${user.currency} ${fee.toLocaleString()}` },
      { label: "Total Deducted", value: `${user.currency} ${(val + fee).toLocaleString()}` },
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
      type: "withdrawal",
      method: "mpesa",
      amount: val,
      fee,
      reference: ref,
    });
    setReceipt({
      title: `${user.currency} ${val.toLocaleString()} Sent to M-Pesa`,
      items: [
        { label: "Name", value: user.name },
        { label: "Phone", value: user.phone },
        { label: "Wallet Number", value: user.walletId },
        { label: "Amount", value: `${user.currency} ${val.toLocaleString()}` },
        { label: "Fee", value: `${user.currency} ${fee.toLocaleString()}` },
        { label: "Currency", value: user.currency },
        { label: "Status", value: "Successful" },
      ],
      reference: ref,
    });
    setAmount("");
  };

  return (
    <DashboardLayout title="Withdraw to M-Pesa">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Withdraw to M-Pesa</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Balance: <span className="font-bold text-foreground">{user.currency} {user.balance.toLocaleString()}</span>
          </p>

          <div className="space-y-5">
            <div>
              <Label className="text-sm font-semibold mb-2 block">M-Pesa Phone Number</Label>
              <Input value={user.phone} readOnly className="bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">Withdrawal will be sent to your registered number</p>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Amount ({user.currency})</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-center text-lg" />
            </div>
            {val > 0 && (
              <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-foreground font-medium">{user.currency} {val.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="text-foreground font-medium">{user.currency} {fee.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total Deducted</span>
                  <span className="text-foreground">{user.currency} {(val + fee).toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button onClick={handleWithdraw} disabled={!amount} className="w-full">
              Withdraw to M-Pesa
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
