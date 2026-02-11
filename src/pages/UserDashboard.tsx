import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  FileText,
  Smartphone,
  Send,
  UserCheck,
} from "lucide-react";

export default function UserDashboard() {
  const { user, transactions } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const userTxns = transactions.filter(
    (t) => t.userId === user.id || t.userName === user.name
  ).slice(0, 8);

  const quickActions = [
    { label: "Buy Airtime", icon: Smartphone, path: "/buy-airtime" },
    { label: "Withdraw to Agent", icon: UserCheck, path: "/withdraw-agent" },
    { label: "Withdraw to M-Pesa", icon: ArrowUpFromLine, path: "/withdraw-mpesa" },
    { label: "Send Money", icon: Send, path: "/send-money" },
    { label: "Deposit", icon: ArrowDownToLine, path: "/deposit" },
    { label: "Statements", icon: FileText, path: "/statements" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="page-container space-y-6">
        {/* Wallet Summary */}
        <div className="form-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Wallet Balance</p>
              <p className="text-3xl font-bold text-foreground mt-1">
                KES {user.balance.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Wallet ID: {user.walletId}</p>
            </div>
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Wallet className="h-7 w-7 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="action-card py-4 gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <a.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Recent Transactions</h2>
          <div className="space-y-0">
            {userTxns.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No transactions yet</p>
            )}
            {userTxns.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    {txn.type === "deposit" && <ArrowDownToLine className="h-4 w-4 text-success" />}
                    {txn.type === "withdrawal" && <ArrowUpFromLine className="h-4 w-4 text-destructive" />}
                    {(txn.type === "transfer" || txn.type === "send_money") && <ArrowLeftRight className="h-4 w-4 text-primary" />}
                    {txn.type === "airtime" && <Smartphone className="h-4 w-4 text-primary" />}
                    {txn.type === "kyc_update" && <FileText className="h-4 w-4 text-warning" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {txn.type === "deposit" ? (txn.method === "mpesa" ? "M-Pesa Deposit" : "Deposit") :
                       txn.type === "withdrawal" ? (txn.method === "mpesa" ? "M-Pesa Withdrawal" : "Withdrawal") :
                       txn.type === "transfer" ? "Transfer" :
                       txn.type === "send_money" ? "Send Money" :
                       txn.type === "airtime" ? "Airtime" : "KYC Update"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {txn.date} · {txn.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${txn.type === "deposit" ? "text-success" : (txn.type === "withdrawal" || txn.type === "transfer" || txn.type === "send_money" || txn.type === "airtime") ? "text-destructive" : "text-foreground"}`}>
                    {txn.type === "deposit" ? "+" : txn.amount ? "-" : ""}KES {txn.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{txn.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
