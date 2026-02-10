import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  const { allUsers, updateUser } = useAuth();
  const users = allUsers.filter((u) => u.role === "user");

  return (
    <DashboardLayout title="Manage Users">
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
                  <th className="pb-3 font-medium">KYC</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{u.name}</td>
                    <td className="py-3 text-foreground">{u.phone}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{u.walletId}</td>
                    <td className="py-3 text-foreground font-medium">KES {u.balance.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.kycStatus === "approved" ? "bg-success text-success-foreground" : u.kycStatus === "pending" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>
                        {u.kycStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button variant="outline" size="sm" onClick={() => { updateUser(u.id, { balance: 0 }); toast.success(`${u.name}'s wallet frozen`); }}>
                        <Ban className="h-3 w-3 mr-1" /> Freeze
                      </Button>
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
