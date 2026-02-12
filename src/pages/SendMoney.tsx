import { useState, useMemo } from "react";
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

export default function SendMoney() {
  const { user, allUsers, processTransaction } = useAuth();
  const [recipientPhone, setRecipientPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const recipient = useMemo(
    () => user ? allUsers.find((u) => u.phone === recipientPhone && u.id !== user.id) : undefined,
    [recipientPhone, allUsers, user]
  );

  if (!user) return null;

  const val = parseFloat(amount || "0");
  const fee = val > 0 ? calculateFee(val, "transfer") : 0;

  const handleSend = () => {
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    if (!recipientPhone) { toast.error("Enter recipient phone number"); return; }
    if (!recipient) { toast.error("Recipient not found"); return; }
    if (val + fee > user.balance) { toast.error("Insufficient balance"); return; }
    setShowConfirm(true);
  };

  const confirmInfo: ConfirmInfo = {
    title: "Confirm Send Money",
    details: [
      { label: "Recipient Name", value: recipient?.name || recipientPhone },
      { label: "Recipient Phone", value: recipientPhone },
      { label: "Recipient Wallet", value: recipient?.walletId || "-" },
      { label: "Your Wallet", value: user.walletId },
      { label: "Amount", value: `${user.currency} ${val.toLocaleString()}` },
      { label: "Fee", value: `${user.currency} ${fee.toLocaleString()}` },
      { label: "Total", value: `${user.currency} ${(val + fee).toLocaleString()}` },
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
      type: "send_money",
      amount: val,
      fee,
      reference: ref,
      recipientPhone,
      recipientWallet: recipient?.walletId,
    });
    setReceipt({
      title: `${user.currency} ${val.toLocaleString()} Sent`,
      items: [
        { label: "Recipient", value: recipient?.name || recipientPhone },
        { label: "Recipient Wallet", value: recipient?.walletId || "-" },
        { label: "Your Wallet", value: user.walletId },
        { label: "Amount", value: `${user.currency} ${val.toLocaleString()}` },
        { label: "Fee", value: `${user.currency} ${fee.toLocaleString()}` },
        { label: "Currency", value: user.currency },
        { label: "Status", value: "Successful" },
      ],
      reference: ref,
    });
    setAmount("");
    setRecipientPhone("");
  };

  return (
    <DashboardLayout title="Send Money">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Send Money</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Balance: <span className="font-bold text-foreground">{user.currency} {user.balance.toLocaleString()}</span>
          </p>

          <div className="space-y-5">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Recipient Phone Number</Label>
              <Input placeholder="07XXXXXXXX" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} />
              {recipient && (
                <div className="mt-2 bg-muted rounded-lg p-3 text-sm space-y-1">
                  <p className="font-medium text-foreground">{recipient.name}</p>
                  <p className="text-muted-foreground">Wallet: {recipient.walletId}</p>
                </div>
              )}
              {recipientPhone.length >= 10 && !recipient && (
                <p className="text-sm text-destructive mt-1">Recipient not found</p>
              )}
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
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{user.currency} {(val + fee).toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button onClick={handleSend} disabled={!amount || !recipientPhone} className="w-full">
              Send Money
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
