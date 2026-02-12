import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Bell } from "lucide-react";

export default function Notifications() {
  const { user, notifications } = useAuth();
  if (!user) return null;

  const userNotifs = notifications.filter((n) => n.userId === user.id);

  return (
    <DashboardLayout title="Notifications">
      <div className="page-container">
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Transaction Notifications</h2>
          <div className="space-y-0">
            {userNotifs.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center">No notifications yet</p>
            )}
            {userNotifs.map((n) => (
              <div key={n.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
