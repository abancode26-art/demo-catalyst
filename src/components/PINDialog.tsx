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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const DEMO_PIN = "1234";

interface PINDialogProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  title?: string;
  description?: string;
}

export function PINDialog({ open, onClose, onVerified, title, description }: PINDialogProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleVerify = useCallback(() => {
    if (pin === DEMO_PIN) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setPin("");
        setAttempts(0);
        onVerified();
      }, 1200);
    } else {
      setAttempts((a) => a + 1);
      if (attempts >= 2) {
        toast.error("Too many incorrect attempts. Please try again later.");
        setPin("");
        setAttempts(0);
        onClose();
      } else {
        toast.error("Incorrect PIN. Please try again.");
        setPin("");
      }
    }
  }, [pin, attempts, onVerified, onClose]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {title || "Enter Transaction PIN"}
          </DialogTitle>
          <DialogDescription>
            {description || "Enter your 4-digit transaction PIN to confirm."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <InputOTP maxLength={4} value={pin} onChange={setPin}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            onClick={handleVerify}
            disabled={pin.length !== 4 || loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Verifying..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
