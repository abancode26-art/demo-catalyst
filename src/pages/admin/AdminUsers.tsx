import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ban, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminUsers() {
  const { allUsers, updateUser, transactions } = useAuth();
  const [search, setSearch] = useState("");
  const [viewUser, setViewUser] = useState<string | null>(null);
  const users = allUsers.filter((u) => u.role === "user");

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search) ||
    u.walletId.includes(search)
  );

  const selectedUser = allUsers.find(u => u.id === viewUser);
  const selectedTxns = transactions.filter(t => t.userId === viewUser).slice(0, 10);

  return (
    <DashboardLayout title="Manage Users">
      <div className="page-container">
        <div className="form-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or wallet number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Wallet Number</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Currency</th>
                  <th className="pb-3 font-medium">KYC</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{u.name}</td>
                    <td className="py-3 text-foreground">{u.phone}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{u.walletId}</td>
                    <td className="py-3 text-foreground font-medium">{u.currency} {u.balance.toLocaleString()}</td>
                    <td className="py-3 text-foreground">{u.currency}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.kycStatus === "approved" ? "bg-success text-success-foreground" : u.kycStatus === "pending" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`}>
                        {u.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setViewUser(u.id)}>
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
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

        {/* User Detail Dialog */}
        <Dialog open={!!viewUser} onOpenChange={(o) => !o && setViewUser(null)}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium text-foreground">{selectedUser.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium text-foreground">{selectedUser.phone}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Wallet Number</span><span className="font-medium text-foreground">{selectedUser.walletId}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Balance</span><span className="font-medium text-foreground">{selectedUser.currency} {selectedUser.balance.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span className="font-medium text-foreground">{selectedUser.currency}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">KYC Status</span><span className="font-medium text-foreground capitalize">{selectedUser.kycStatus}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Deposits</span><span className="font-medium text-foreground">{selectedUser.currency} {selectedUser.totalDeposits.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Withdrawn</span><span className="font-medium text-foreground">{selectedUser.currency} {selectedUser.totalWithdrawn.toLocaleString()}</span></div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Recent Transactions</h3>
                  {selectedTxns.length === 0 && <p className="text-sm text-muted-foreground">No transactions</p>}
                  {selectedTxns.map(txn => (
                    <div key={txn.id} className="flex justify-between text-xs py-2 border-b border-border last:border-0">
                      <span className="text-foreground">{txn.date} — {txn.type.replace("_", " ")}</span>
                      <span className="font-medium text-foreground">{selectedUser.currency} {txn.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { updateUser(selectedUser.id, { password: "reset1234" }); toast.success("Password reset to default"); }}>
                    Reset Password
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { updateUser(selectedUser.id, { balance: 0 }); toast.success("Wallet frozen"); }}>
                    <Ban className="h-3 w-3 mr-1" /> Freeze Wallet
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
