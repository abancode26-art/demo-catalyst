import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Currency } from "@/lib/demo-data";

export default function AdminCurrencies() {
  const { currencies, addCurrency, toggleCurrency } = useAuth();
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");

  const handleAdd = () => {
    if (!newCode || !newName) { toast.error("Fill in currency code and name"); return; }
    if (currencies.find(c => c.code === newCode.toUpperCase())) { toast.error("Currency already exists"); return; }
    addCurrency({
      code: newCode.toUpperCase(),
      name: newName,
      symbol: newSymbol || newCode.toUpperCase(),
      enabled: true,
    });
    setNewCode("");
    setNewName("");
    setNewSymbol("");
    toast.success("Currency added");
  };

  return (
    <DashboardLayout title="Currency Management">
      <div className="page-container space-y-6">
        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Global Currencies</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Code</th>
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((c) => (
                <tr key={c.code} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium text-foreground">{c.code}</td>
                  <td className="py-3 text-foreground">{c.name}</td>
                  <td className="py-3 text-foreground">{c.symbol}</td>
                  <td className="py-3">
                    <Switch checked={c.enabled} onCheckedChange={() => toggleCurrency(c.code)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-card">
          <h2 className="text-base font-semibold text-foreground mb-4">Add Currency</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Code</Label>
              <Input placeholder="e.g. JPY" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Name</Label>
              <Input placeholder="e.g. Japanese Yen" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm">Symbol</Label>
              <Input placeholder="e.g. ¥" value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleAdd} className="mt-4">Add Currency</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
