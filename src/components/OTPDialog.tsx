import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { DEMO_OTP } from "@/lib/demo-data";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OTPDialogProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  phone?: string;
}

export function OTPDialog({ open, onClose, onVerified, phone }: OTPDialogProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleVerify = useCallback(() => {
    if (otp === DEMO_OTP) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setOtp("");
        setAttempts(0);
        onVerified();
      }, 1500);
    } else {
      setAttempts((a) => a + 1);
      if (attempts >= 2) {
        toast.error("Too many attempts. Please try again.");
        setOtp("");
        setAttempts(0);
        onClose();
      } else {
        toast.error("Invalid OTP. Please try again.");
        setOtp("");
      }
    }
  }, [otp, attempts, onVerified, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Verify Your Identity</DialogTitle>
          <DialogDescription>
            OTP sent to {phone || "your phone"}. Enter the 6-digit code.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            onClick={handleVerify}
            disabled={otp.length !== 6 || loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Didn't receive? <button className="text-primary font-medium">Resend OTP</button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
