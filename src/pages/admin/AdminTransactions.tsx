import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminTransactions() {
  const { transactions } = useAuth();
  const [activeTab, setActiveTab] = useState<"deposits" | "withdrawals" | "transfers" | "statements" | "reports">("deposits");

  const statusColor: Record<string, string> = {
    completed: "bg-success text-success-foreground",
    successful: "bg-success text-success-foreground",
    pending: "bg-warning text-warning-foreground",
    failed: "bg-destructive text-destructive-foreground",
  };

  const tabs = [
    { id: "deposits" as const, label: "Deposits" },
    { id: "withdrawals" as const, label: "Withdrawals" },
    { id: "transfers" as const, label: "Transfers" },
    { id: "statements" as const, label: "Statements" },
    { id: "reports" as const, label: "Reports" },
  ];

  const filtered = transactions.filter((txn) => {
    if (activeTab === "deposits") return txn.type === "deposit";
    if (activeTab === "withdrawals") return txn.type === "withdrawal";
    if (activeTab === "transfers") return txn.type === "transfer" || txn.type === "send_money";
    if (activeTab === "statements") return false;
    if (activeTab === "reports") return false;
    return true;
  });

  return (
    <DashboardLayout title="Transactions">
      <div className="page-container">
        <div className="form-card">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "reports" ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm">Reports module coming soon</p>
            </div>
          ) : activeTab === "statements" ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm">Statement logs will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Reference</th>
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Fee</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn) => (
                    <tr key={txn.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-foreground">{txn.date}</td>
                      <td className="py-3 text-muted-foreground font-mono text-xs">{txn.reference}</td>
                      <td className="py-3 font-medium text-foreground">{txn.userName}</td>
                      <td className="py-3 text-foreground capitalize">{txn.type.replace("_", " ")}</td>
                      <td className="py-3 font-medium text-foreground">
                        {txn.amount > 0 ? `KES ${txn.amount.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-3 text-muted-foreground">KES {txn.fee.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[txn.status]}`}>
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground text-sm">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
