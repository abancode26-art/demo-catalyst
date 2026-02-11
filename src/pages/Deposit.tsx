import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OTPDialog } from "@/components/OTPDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Deposit() {
  const { user, deposit } = useAuth();
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
    setTimeout(() => {
      deposit(parseFloat(amount), "mpesa");
      setProcessing(false);
      setAmount("");
      toast.info("Enter M-Pesa PIN on your phone to confirm");
    }, 2000);
  };

  return (
    <DashboardLayout title="Deposit Funds">
      <div className="page-container">
        <div className="max-w-xl mx-auto form-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">Add Money via M-Pesa</h2>

          <div className="space-y-6">
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
