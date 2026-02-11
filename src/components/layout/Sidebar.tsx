import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  FileText,
  UserCircle,
  LogOut,
  Users,
  UserCheck,
  ClipboardList,
  DollarSign,
  ScrollText,
  Settings,
  Landmark,
  ChevronRight,
  Smartphone,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const userNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Buy Airtime", icon: Smartphone, path: "/buy-airtime" },
  { label: "Withdraw to Agent", icon: UserCheck, path: "/withdraw-agent" },
  { label: "Withdraw to M-Pesa", icon: ArrowUpFromLine, path: "/withdraw-mpesa" },
  { label: "Send Money", icon: Send, path: "/send-money" },
  { label: "Deposit", icon: ArrowDownToLine, path: "/deposit" },
  { label: "Statements", icon: FileText, path: "/statements" },
  { label: "Profile & KYC", icon: UserCircle, path: "/profile" },
];

const agentNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Deposit to User", icon: ArrowDownToLine, path: "/agent-deposit" },
  { label: "Withdraw to M-Pesa", icon: ArrowUpFromLine, path: "/withdraw-mpesa" },
  { label: "Withdraw to Wallet", icon: ArrowLeftRight, path: "/withdraw" },
  { label: "Transfer", icon: ArrowLeftRight, path: "/transfer" },
  { label: "Statements", icon: FileText, path: "/statements" },
  { label: "Profile & KYC", icon: UserCircle, path: "/profile" },
];

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Agents", icon: UserCheck, path: "/admin/agents" },
  { label: "KYC Approvals", icon: ClipboardList, path: "/admin/kyc" },
  { label: "Transactions", icon: ScrollText, path: "/admin/transactions" },
  { label: "Fees & Commissions", icon: DollarSign, path: "/admin/fees" },
  { label: "Audit Logs", icon: FileText, path: "/admin/audit" },
  { label: "System Settings", icon: Settings, path: "/admin/settings" },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const navItems = isAdmin ? adminNavItems : user.role === "agent" ? agentNavItems : userNavItems;
  const subtitle = isAdmin ? "Admin Dashboard" : user.role === "agent" ? "Agent Account" : "Personal Account";

  return (
    <aside className="w-[280px] min-h-screen bg-sidebar flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-sidebar-active flex items-center justify-center">
          <Landmark className="h-5 w-5 text-sidebar-active-foreground" />
        </div>
        <div>
          <div className="font-bold text-sidebar-user text-base">AbanRemit</div>
          <div className="text-xs text-sidebar-sublabel">{subtitle}</div>
        </div>
      </div>

      {/* User info */}
      {!isAdmin && (
        <div className="px-5 pb-4">
          <div className="font-semibold text-sidebar-user text-sm">{user.name}</div>
          <div className="text-xs text-sidebar-sublabel">ID: {user.walletId}</div>
        </div>
      )}
      {isAdmin && (
        <div className="px-5 pb-2">
          <div className="font-bold text-sidebar-user text-sm">Admin</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-active text-sidebar-active-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-hover"
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="h-4 w-4" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 mt-auto">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
