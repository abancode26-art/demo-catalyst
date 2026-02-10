import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminAudit() {
  const { transactions } = useAuth();

  return (
    <DashboardLayout title="Audit Logs">
      <div className="page-container">
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">System Audit Trail</h2>
          <div className="space-y-3">
            {transactions.slice(0, 10).map((txn) => (
              <div key={txn.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{txn.userName}</span> performed{" "}
                    <span className="font-medium">{txn.type.replace("_", " ")}</span>
                    {txn.amount > 0 && ` of KES ${txn.amount.toLocaleString()}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {txn.date} · {txn.reference}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
