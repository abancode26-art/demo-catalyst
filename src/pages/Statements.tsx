import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Statements() {
  const { user, transactions, chargeStatementDownload } = useAuth();
  if (!user) return null;

  const isAdmin = user.role === "admin";
  const txns = isAdmin ? transactions : transactions.filter((t) => t.userId === user.id);

  const statusColor: Record<string, string> = {
    completed: "bg-success text-success-foreground",
    successful: "bg-success text-success-foreground",
    pending: "bg-warning text-warning-foreground",
    failed: "bg-destructive text-destructive-foreground",
  };

  return (
    <DashboardLayout title="Statements">
      <div className="page-container">
        <div className="form-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Transaction History</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (chargeStatementDownload()) {
                  // Trigger CSV download
                  const headers = ["Date","Reference","Type","Amount","Fee","Status"];
                  const rows = txns.map(t => [t.date, t.reference, t.type, t.amount, t.fee, t.status]);
                  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "statement.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Download (KES 50)
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Reference</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Fee</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((txn) => (
                  <tr key={txn.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-foreground">{txn.date}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{txn.reference}</td>
                    <td className="py-3 text-foreground capitalize">{txn.type.replace("_", " ")}</td>
                    <td className={`py-3 font-medium ${txn.type === "deposit" ? "text-success" : "text-foreground"}`}>
                      {txn.amount > 0 ? `${txn.type === "deposit" ? "+" : "-"}KES ${txn.amount.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3 text-muted-foreground">KES {txn.fee.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[txn.status]}`}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
