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
import { calculateFee, generateTransactionId } from "@/lib/demo-data";

const NETWORKS = ["Safaricom", "Airtel", "Telkom"];
const AIRTIME_PRESETS = [50, 100, 200, 500, 1000, 2000];

export default function SellAirtime() {
  const { user, processTransaction } = useAuth();
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  if (!user) return null;
  const val = parseFloat(amount || "0");

  const handleSell = () => {
    if (!network) { toast.error("Select a network"); return; }
    if (!phone) { toast.error("Enter customer phone number"); return; }
    if (!val || val <= 0) { toast.error("Enter amount"); return; }
    if (val > user.balance) { toast.error("Insufficient agent balance"); return; }
    setShowConfirm(true);
  };

  const confirmInfo: ConfirmInfo = {
    title: "Confirm Airtime Sale",
    details: [
      { label: "Network", value: network },
      { label: "Customer Phone", value: phone },
      { label: "Amount", value: `${user.currency} ${val.toLocaleString()}` },
      { label: "Agent Wallet", value: user.walletId },
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
      network,
    });
    setReceipt({
      title: `${user.currency} ${val.toLocaleString()} Airtime Sold`,
      items: [
        { label: "Network", value: network },
        { label: "Customer Phone", value: phone },
        { label: "Amount", value: `${user.currency} ${val.toLocaleString()}` },
        { label: "Agent Wallet", value: user.walletId },
        { label: "Currency", value: user.currency },
        { label: "Status", value: "Successful" },
      ],
      reference: ref,
    });
    setAmount("");
    setPhone("");
  };

  return (
    <DashboardLayout title="Sell Airtime">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-1">Sell Airtime</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Agent Balance: <span className="font-bold text-foreground">{user.currency} {user.balance.toLocaleString()}</span>
          </p>

          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-3 block">Select Network</Label>
              <div className="flex gap-3">
                {NETWORKS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNetwork(n)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                      network === n
                        ? "border-primary text-primary bg-accent"
                        : "border-border text-foreground hover:border-muted-foreground"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Customer Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Amount ({user.currency})</Label>
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

            <Button onClick={handleSell} disabled={!amount || !network || !phone} className="w-full">
              Sell Airtime
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
