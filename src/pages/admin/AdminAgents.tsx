import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Ban } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminAgents() {
  const { allUsers, updateUser, transactions } = useAuth();
  const [search, setSearch] = useState("");
  const [viewAgent, setViewAgent] = useState<string | null>(null);
  const agents = allUsers.filter((u) => u.role === "agent");

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.phone.includes(search) ||
    a.walletId.includes(search)
  );

  const selectedAgent = allUsers.find(u => u.id === viewAgent);
  const selectedTxns = transactions.filter(t => t.userId === viewAgent).slice(0, 10);

  return (
    <DashboardLayout title="Manage Agents">
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
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="py-3 font-medium text-foreground">{a.name}</td>
                    <td className="py-3 text-foreground">{a.phone}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{a.walletId}</td>
                    <td className="py-3 text-foreground font-medium">{a.currency} {a.balance.toLocaleString()}</td>
                    <td className="py-3 text-foreground">{a.currency}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-success text-success-foreground">Active</span>
                    </td>
                    <td className="py-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setViewAgent(a.id)}>
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { updateUser(a.id, { balance: 0 }); toast.success(`${a.name}'s wallet frozen`); }}>
                        <Ban className="h-3 w-3 mr-1" /> Freeze
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={!!viewAgent} onOpenChange={(o) => !o && setViewAgent(null)}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agent Profile</DialogTitle>
            </DialogHeader>
            {selectedAgent && (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium text-foreground">{selectedAgent.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium text-foreground">{selectedAgent.phone}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Wallet Number</span><span className="font-medium text-foreground">{selectedAgent.walletId}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Balance</span><span className="font-medium text-foreground">{selectedAgent.currency} {selectedAgent.balance.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span className="font-medium text-foreground">{selectedAgent.currency}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">KYC Status</span><span className="font-medium text-foreground capitalize">{selectedAgent.kycStatus}</span></div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Recent Transactions</h3>
                  {selectedTxns.length === 0 && <p className="text-sm text-muted-foreground">No transactions</p>}
                  {selectedTxns.map(txn => (
                    <div key={txn.id} className="flex justify-between text-xs py-2 border-b border-border last:border-0">
                      <span className="text-foreground">{txn.date} — {txn.type.replace("_", " ")}</span>
                      <span className="font-medium text-foreground">{selectedAgent.currency} {txn.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={() => { updateUser(selectedAgent.id, { password: "reset1234" }); toast.success("Password reset to default"); }}>
                  Reset Password
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
