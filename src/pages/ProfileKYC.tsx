import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function ProfileKYC() {
  const { user, currencies } = useAuth();
  if (!user) return null;

  const enabledCurrencies = currencies.filter(c => c.enabled);

  const kycIcon = {
    approved: <CheckCircle className="h-5 w-5 text-success" />,
    pending: <Clock className="h-5 w-5 text-warning" />,
    rejected: <XCircle className="h-5 w-5 text-destructive" />,
  };

  const kycBadge = {
    approved: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    rejected: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <DashboardLayout title="Profile & KYC">
      <div className="page-container space-y-6">
        {/* Profile */}
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Full Name</Label>
              <Input value={user.name} readOnly className="bg-muted" />
            </div>
            <div>
              <Label className="text-sm">Phone Number</Label>
              <Input value={user.phone} readOnly className="bg-muted" />
            </div>
            <div>
              <Label className="text-sm">Wallet Number</Label>
              <Input value={user.walletId} readOnly className="bg-muted" />
            </div>
            <div>
              <Label className="text-sm">Account Type</Label>
              <Input value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} readOnly className="bg-muted" />
            </div>
            <div>
              <Label className="text-sm">Preferred Currency</Label>
              <Input value={user.currency} readOnly className="bg-muted" />
            </div>
          </div>
        </div>

        {/* Transaction PIN */}
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Transaction PIN</h2>
          <p className="text-sm text-muted-foreground mb-4">Your transaction PIN is required for all financial operations.</p>
          <Button variant="outline" onClick={() => toast.success("Transaction PIN has been set")}>
            Create / Reset Transaction PIN
          </Button>
        </div>

        {/* Currency Selection */}
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Wallet Currency</h2>
          <p className="text-sm text-muted-foreground mb-3">Select your preferred wallet currency during KYC.</p>
          <div className="flex flex-wrap gap-2">
            {enabledCurrencies.map((c) => (
              <div
                key={c.code}
                className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                  user.currency === c.code
                    ? "border-primary text-primary bg-accent"
                    : "border-border text-muted-foreground"
                }`}
              >
                {c.code} — {c.name}
              </div>
            ))}
          </div>
        </div>

        {/* KYC */}
        <div className="form-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">KYC Verification</h2>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${kycBadge[user.kycStatus]}`}>
              {kycIcon[user.kycStatus]}
              {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">ID Document (Front)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
            <div>
              <Label className="text-sm mb-2 block">Selfie with ID</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
            <Button className="w-full sm:w-auto">Submit for Verification</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
