import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  FileText,
  TrendingUp,
} from "lucide-react";

export default function UserDashboard() {
  const { user, transactions } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const userTxns = transactions.filter(
    (t) => t.userId === user.id || t.userName === user.name
  ).slice(0, 5);

  const stats = [
    { label: "Wallet Balance", value: user.balance, icon: Wallet, sub: "+12% this month" },
    { label: "Total Deposits", value: user.totalDeposits, icon: ArrowDownToLine },
    { label: "Total Withdrawn", value: user.totalWithdrawn, icon: ArrowUpFromLine },
    { label: "Transfers", value: user.totalTransfers, icon: TrendingUp },
  ];

  const quickActions = [
    { label: "Deposit", icon: ArrowDownToLine, path: "/deposit" },
    { label: "Withdraw", icon: ArrowUpFromLine, path: "/withdraw" },
    { label: "Statements", icon: FileText, path: "/statements" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="page-container space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  KES {s.value.toLocaleString()}
                </p>
                {s.sub && <p className="text-xs text-success mt-1">{s.sub}</p>}
              </div>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <s.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="action-card">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <a.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {userTxns.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No transactions yet</p>
            )}
            {userTxns.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    {txn.type === "deposit" && <ArrowDownToLine className="h-4 w-4 text-success" />}
                    {txn.type === "withdrawal" && <ArrowUpFromLine className="h-4 w-4 text-destructive" />}
                    {txn.type === "transfer" && <ArrowLeftRight className="h-4 w-4 text-primary" />}
                    {txn.type === "kyc_update" && <FileText className="h-4 w-4 text-warning" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {txn.method ? `${txn.method === "mpesa" ? "MPesa" : "Card"} ${txn.type === "deposit" ? "Deposit" : "Withdrawal"}` : txn.type === "transfer" ? "Transfer" : "KYC Update"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {txn.date} · {txn.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === "deposit" ? "text-success" : txn.type === "withdrawal" || txn.type === "transfer" ? "text-destructive" : "text-foreground"}`}>
                    {txn.type === "deposit" ? "+" : txn.amount ? "-" : ""}KES {txn.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{txn.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
