import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminAgents() {
  const { allUsers } = useAuth();
  const agents = allUsers.filter((u) => u.role === "agent");

  return (
    <DashboardLayout title="Manage Agents">
      <div className="page-container">
        <div className="form-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Wallet ID</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{a.name}</td>
                    <td className="py-3 text-foreground">{a.phone}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{a.walletId}</td>
                    <td className="py-3 text-foreground font-medium">KES {a.balance.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-success text-success-foreground">Active</span>
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
