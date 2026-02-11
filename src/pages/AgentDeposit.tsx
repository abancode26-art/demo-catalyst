import { useState, useMemo } from "react";
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

export default function AgentDeposit() {
  const { user, allUsers, processTransaction } = useAuth();
  const [method, setMethod] = useState<"mpesa" | "wallet">("wallet");
  const [walletNumber, setWalletNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const targetUser = useMemo(
    () => allUsers.find((u) => u.walletId === walletNumber),
    [walletNumber, allUsers]
  );

  if (!user) return null;

  const val = parseFloat(amount || "0");

  const handleDeposit = () => {
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    if (!walletNumber) { toast.error("Enter wallet number"); return; }
    if (!targetUser) { toast.error("Wallet not found"); return; }
    setShowConfirm(true);
  };

  const confirmInfo: ConfirmInfo = {
    title: "Confirm Deposit to User",
    details: [
      { label: "User Name", value: targetUser?.name || "-" },
      { label: "Phone Number", value: targetUser?.phone || "-" },
      { label: "Wallet Number", value: walletNumber },
      { label: "Deposit Method", value: method === "mpesa" ? "M-Pesa" : "Wallet" },
      { label: "Amount", value: `KES ${val.toLocaleString()}` },
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
      type: "deposit",
      method: method === "mpesa" ? "mpesa" : undefined,
      amount: val,
      fee: 0,
      reference: ref,
      targetUserId: targetUser?.id,
    });
    setReceipt({
      title: `KES ${val.toLocaleString()} Deposited`,
      items: [
        { label: "User", value: targetUser?.name || walletNumber },
        { label: "Phone", value: targetUser?.phone || "-" },
        { label: "Method", value: method === "mpesa" ? "M-Pesa" : "Wallet" },
        { label: "Amount", value: `KES ${val.toLocaleString()}` },
        { label: "Status", value: "Successful" },
      ],
      reference: ref,
    });
    setAmount("");
    setWalletNumber("");
  };

  return (
    <DashboardLayout title="Deposit to User">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Load User Wallet</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your balance: <span className="font-bold text-foreground">KES {user.balance.toLocaleString()}</span>
          </p>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block">Deposit Method</Label>
              <div className="flex gap-3">
                {(["mpesa", "wallet"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                      method === m
                        ? "border-primary text-primary bg-accent"
                        : "border-border text-foreground hover:border-muted-foreground"
                    )}
                  >
                    {m === "mpesa" ? "M-Pesa" : "Wallet"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">User Wallet Number</Label>
              <Input placeholder="WLT-XXXX-XXXX" value={walletNumber} onChange={(e) => setWalletNumber(e.target.value)} />
              {targetUser && (
                <div className="mt-2 bg-muted rounded-lg p-3 text-sm space-y-1">
                  <p className="font-medium text-foreground">{targetUser.name}</p>
                  <p className="text-muted-foreground">Phone: {targetUser.phone}</p>
                </div>
              )}
              {walletNumber.length >= 8 && !targetUser && (
                <p className="text-sm text-destructive mt-1">Wallet not found</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Amount (KES)</Label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-center text-lg" />
            </div>

            <Button onClick={handleDeposit} disabled={!amount || !walletNumber} className="w-full">
              Deposit
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
