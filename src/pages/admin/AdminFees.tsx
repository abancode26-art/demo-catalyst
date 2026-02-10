import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DEMO_FEES, DEMO_COMMISSIONS, FeeConfig, CommissionConfig } from "@/lib/demo-data";
import { toast } from "sonner";

export default function AdminFees() {
  const [fees, setFees] = useState<FeeConfig[]>([...DEMO_FEES]);
  const [commissions] = useState<CommissionConfig[]>([...DEMO_COMMISSIONS]);

  const toggleFee = (id: string) => {
    setFees((prev) => prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  };

  return (
    <DashboardLayout title="Fees & Commissions">
      <div className="page-container space-y-6">
        <p className="text-sm text-muted-foreground">
          Fees & Commissions &gt; <span className="font-medium text-foreground">Fees & Fees</span>
        </p>

        {/* Transaction Fees */}
        <div className="form-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Transaction Fees</h2>
            <Button size="sm">+ Add Fee</Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Transaction Type</th>
                <th className="pb-3 font-medium">Fee Type</th>
                <th className="pb-3 font-medium">Fee Amount</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-foreground font-medium">{f.transactionType}</td>
                  <td className="py-3 text-foreground capitalize">{f.feeType}</td>
                  <td className="py-3 text-foreground font-medium">
                    {f.feeType === "percentage" ? `${f.feeAmount}%` : `KES ${f.feeAmount}`}
                  </td>
                  <td className="py-3 flex items-center gap-3">
                    <Switch checked={f.active} onCheckedChange={() => toggleFee(f.id)} />
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agent Commissions */}
        <div className="form-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Agent Commissions</h2>
            <Button size="sm">+ Add Commission</Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Commission Type</th>
                <th className="pb-3 font-medium">Rate</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-foreground font-medium">{c.commissionType}</td>
                  <td className="py-3 text-foreground font-medium">{c.rate}%</td>
                  <td className="py-3">
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <Button onClick={() => toast.success("Changes saved successfully")}>Save Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
