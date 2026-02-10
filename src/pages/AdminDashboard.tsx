import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { ADMIN_STATS } from "@/lib/demo-data";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  UserCheck,
  ClipboardList,
  Settings,
  FileText,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { transactions, allUsers } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Wallet Balance", value: ADMIN_STATS.totalWalletBalance, icon: Wallet },
    { label: "Total Deposits", value: ADMIN_STATS.totalDeposits, icon: ArrowDownToLine },
    { label: "Total Withdrawn", value: ADMIN_STATS.totalWithdrawn, icon: ArrowUpFromLine },
    { label: "Pending KYC Approvals", value: ADMIN_STATS.pendingKYC, icon: ClipboardList, isBadge: true },
  ];

  const quickActions = [
    { label: "Manage Users", icon: Users, path: "/admin/users" },
    { label: "Manage Agents", icon: UserCheck, path: "/admin/agents" },
    { label: "KYC Approvals", icon: ClipboardList, path: "/admin/kyc", badge: "5 Pending" },
    { label: "Fees & Settings", icon: Settings, path: "/admin/fees" },
    { label: "Audit Logs", icon: FileText, path: "/admin/audit" },
  ];

  const recentTxns = transactions.slice(0, 4);

  const statusColor: Record<string, string> = {
    completed: "bg-success text-success-foreground",
    successful: "bg-success text-success-foreground",
    pending: "bg-warning text-warning-foreground",
    failed: "bg-destructive text-destructive-foreground",
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="page-container space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                {s.isBadge ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-sm font-bold">
                      {s.value}
                    </span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-foreground mt-1">
                    KES {s.value.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <s.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.path)} className="action-card relative">
              {a.badge && (
                <span className="absolute top-2 right-2 text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full font-medium">
                  {a.badge}
                </span>
              )}
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <a.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{a.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 form-card">
            <h2 className="text-base font-semibold text-foreground mb-4">Recent Transactions</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map((txn) => (
                  <tr key={txn.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-foreground">{txn.date.split(" ")[0]}</td>
                    <td className="py-3 font-medium text-foreground">{txn.userName}</td>
                    <td className="py-3 text-foreground capitalize">
                      {txn.type === "kyc_update" ? "KYC Update" : txn.type}
                    </td>
                    <td className={`py-3 font-medium ${txn.type === "deposit" ? "text-success" : "text-foreground"}`}>
                      {txn.amount > 0 ? `${txn.type === "deposit" ? "+" : "-"}KES ${txn.amount.toLocaleString()}` : ""}
                    </td>
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

          {/* System Overview */}
          <div className="form-card">
            <h2 className="text-base font-semibold text-foreground mb-4">System Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">Active Users</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">{ADMIN_STATS.activeUsers.toLocaleString()}</span>{" "}
                  <span className="text-success font-medium">Online <TrendingUp className="inline h-3 w-3" /></span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <span className="text-sm text-foreground">Active Agents</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">{ADMIN_STATS.activeAgents}</span>{" "}
                  <span className="text-muted-foreground">Agents</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="text-sm text-foreground">System Alerts</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">{ADMIN_STATS.systemAlerts}</span>{" "}
                  <span className="text-destructive font-medium">Alerts <AlertTriangle className="inline h-3 w-3" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
