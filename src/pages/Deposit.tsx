import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OTPDialog } from "@/components/OTPDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Deposit() {
  const { user, deposit } = useAuth();
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [amount, setAmount] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!user) return null;

  const presets = [500, 1000, 5000, 10000];

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      deposit(parseFloat(amount), method);
      setProcessing(false);
      setAmount("");
      if (method === "mpesa") {
        toast.info("Enter MPesa PIN on your phone to confirm");
      }
    }, 2000);
  };

  return (
    <DashboardLayout title="Deposit Funds">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Add Money to Wallet</h2>

          <div className="space-y-6">
            {/* Payment Method */}
            <div>
              <Label className="text-sm font-semibold mb-3 block">Payment Method</Label>
              <div className="flex gap-3">
                {(["mpesa", "card"] as const).map((m) => (
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
                    {m === "mpesa" ? "M-Pesa" : "Card"}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Amount (KES)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-center text-lg"
              />
              <div className="flex gap-2 mt-3">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(String(p))}
                    className="flex-1 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {p.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Card fields */}
            {method === "card" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Card Number</Label>
                  <Input placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Expiry</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label className="text-sm">CVV</Label>
                    <Input placeholder="123" />
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleDeposit}
              disabled={processing || !amount}
              className="w-full"
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {processing ? "Processing..." : `Deposit KES ${parseFloat(amount || "0").toLocaleString()}`}
            </Button>
          </div>
        </div>

        <OTPDialog
          open={showOTP}
          onClose={() => setShowOTP(false)}
          onVerified={handleOTPVerified}
          phone={user.phone}
        />
      </div>
    </DashboardLayout>
  );
}
