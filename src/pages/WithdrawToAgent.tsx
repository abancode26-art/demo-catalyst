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

export default function WithdrawToAgent() {
  const { user, allUsers, processTransaction } = useAuth();
  const [agentNumber, setAgentNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  const agent = useMemo(
    () => allUsers.find((u) => u.phone === agentNumber && u.role === "agent"),
    [agentNumber, allUsers]
  );

  if (!user) return null;

  const val = parseFloat(amount || "0");
  const fee = val > 0 ? calculateFee(val, "withdrawal") : 0;

  const handleWithdraw = () => {
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    if (!agentNumber) { toast.error("Enter agent number"); return; }
    if (!agent) { toast.error("Agent not found"); return; }
    if (val + fee > user.balance) { toast.error("Insufficient balance"); return; }
    setShowConfirm(true);
  };

  const confirmInfo: ConfirmInfo = {
    title: "Confirm Withdrawal to Agent",
    details: [
      { label: "Agent Name", value: agent?.name || "-" },
      { label: "Agent ID", value: agent?.walletId || "-" },
      { label: "Agent Number", value: agentNumber },
      { label: "Amount", value: `KES ${val.toLocaleString()}` },
      { label: "Fee", value: `KES ${fee.toLocaleString()}` },
      { label: "Total Deducted", value: `KES ${(val + fee).toLocaleString()}` },
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
      title: `KES ${val.toLocaleString()} Withdrawn`,
      items: [
        { label: "Agent", value: agent?.name || agentNumber },
        { label: "Agent ID", value: agent?.walletId || "-" },
        { label: "Amount", value: `KES ${val.toLocaleString()}` },
        { label: "Fee", value: `KES ${fee.toLocaleString()}` },
        { label: "Status", value: "Successful" },
      ],
      reference: ref,
    });
    setAmount("");
    setAgentNumber("");
  };

  return (
    <DashboardLayout title="Withdraw to Agent">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Withdraw to Agent</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Balance: <span className="font-bold text-foreground">KES {user.balance.toLocaleString()}</span>
          </p>

          <div className="space-y-5">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Agent Number</Label>
              <Input placeholder="07XXXXXXXX" value={agentNumber} onChange={(e) => setAgentNumber(e.target.value)} />
              {agent && (
                <div className="mt-2 bg-muted rounded-lg p-3 text-sm space-y-1">
                  <p className="font-medium text-foreground">{agent.name}</p>
                  <p className="text-muted-foreground">ID: {agent.walletId}</p>
                </div>
              )}
              {agentNumber.length >= 10 && !agent && (
                <p className="text-sm text-destructive mt-1">Agent not found</p>
              )}
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
                  <span className="text-foreground">Total Deducted</span>
                  <span className="text-foreground">KES {(val + fee).toLocaleString()}</span>
                </div>
              </div>
            )}
            <Button onClick={handleWithdraw} disabled={!amount || !agentNumber} className="w-full">
              Withdraw
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
