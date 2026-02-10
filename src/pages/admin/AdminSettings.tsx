import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AdminSettings() {
  return (
    <DashboardLayout title="System Settings">
      <div className="page-container space-y-6">
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">General Settings</h2>
          <div className="space-y-4 max-w-lg">
            <div>
              <Label className="text-sm">System Name</Label>
              <Input defaultValue="AbanRemit" />
            </div>
            <div>
              <Label className="text-sm">Currency</Label>
              <Input defaultValue="KES" readOnly className="bg-muted" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Disable all transactions</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Registration Open</p>
                <p className="text-xs text-muted-foreground">Allow new user signups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button onClick={() => toast.success("Settings saved")}>Save Settings</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
