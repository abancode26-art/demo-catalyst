import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminKYC() {
  const { allUsers, updateUser } = useAuth();
  const pendingUsers = allUsers.filter((u) => u.kycStatus === "pending" || u.kycStatus === "rejected");

  return (
    <DashboardLayout title="KYC Approvals">
      <div className="page-container">
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Pending KYC Reviews</h2>
          {pendingUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No pending KYC reviews</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.phone} · {u.walletId}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { updateUser(u.id, { kycStatus: "approved" }); toast.success(`${u.name} KYC approved`); }}>
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { updateUser(u.id, { kycStatus: "rejected" }); toast.error(`${u.name} KYC rejected`); }}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
