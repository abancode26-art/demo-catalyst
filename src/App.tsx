import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Statements from "./pages/Statements";
import ProfileKYC from "./pages/ProfileKYC";
import BuyAirtime from "./pages/BuyAirtime";
import SendMoney from "./pages/SendMoney";
import WithdrawToAgent from "./pages/WithdrawToAgent";
import WithdrawToMpesa from "./pages/WithdrawToMpesa";
import AgentDeposit from "./pages/AgentDeposit";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminKYC from "./pages/admin/AdminKYC";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminFees from "./pages/admin/AdminFees";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly, agentOnly }: { children: React.ReactNode; adminOnly?: boolean; agentOnly?: boolean }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  if (agentOnly && user.role !== "agent") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute agentOnly><Transfer /></ProtectedRoute>} />
            <Route path="/buy-airtime" element={<ProtectedRoute><BuyAirtime /></ProtectedRoute>} />
            <Route path="/send-money" element={<ProtectedRoute><SendMoney /></ProtectedRoute>} />
            <Route path="/withdraw-agent" element={<ProtectedRoute><WithdrawToAgent /></ProtectedRoute>} />
            <Route path="/withdraw-mpesa" element={<ProtectedRoute><WithdrawToMpesa /></ProtectedRoute>} />
            <Route path="/agent-deposit" element={<ProtectedRoute agentOnly><AgentDeposit /></ProtectedRoute>} />
            <Route path="/statements" element={<ProtectedRoute><Statements /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileKYC /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/agents" element={<ProtectedRoute adminOnly><AdminAgents /></ProtectedRoute>} />
            <Route path="/admin/kyc" element={<ProtectedRoute adminOnly><AdminKYC /></ProtectedRoute>} />
            <Route path="/admin/transactions" element={<ProtectedRoute adminOnly><AdminTransactions /></ProtectedRoute>} />
            <Route path="/admin/fees" element={<ProtectedRoute adminOnly><AdminFees /></ProtectedRoute>} />
            <Route path="/admin/audit" element={<ProtectedRoute adminOnly><AdminAudit /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
