import React, { createContext, useContext, useState, useCallback } from "react";
import { DemoUser, DEMO_USERS, Transaction, DEMO_TRANSACTIONS, generateTransactionId, calculateFee, STATEMENT_DOWNLOAD_FEE } from "@/lib/demo-data";
import { toast } from "sonner";

interface AuthContextType {
  user: DemoUser | null;
  transactions: Transaction[];
  login: (phone: string, password: string) => boolean;
  logout: () => void;
  deposit: (amount: number, method: "mpesa" | "card") => void;
  withdraw: (amount: number, method: "mpesa" | "card") => void;
  transfer: (amount: number, recipientPhone: string) => void;
  chargeStatementDownload: () => boolean;
  allUsers: DemoUser[];
  updateUser: (userId: string, updates: Partial<DemoUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [users, setUsers] = useState<DemoUser[]>([...DEMO_USERS]);
  const [transactions, setTransactions] = useState<Transaction[]>([...DEMO_TRANSACTIONS]);

  const login = useCallback((phone: string, password: string): boolean => {
    const found = users.find((u) => u.phone === phone && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const deposit = useCallback((amount: number, method: "mpesa" | "card") => {
    if (!user) return;
    const fee = calculateFee(amount, "deposit");
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      userId: user.id,
      userName: user.name,
      type: "deposit",
      method,
      amount,
      fee,
      status: "completed",
      reference: generateTransactionId(),
    };
    setTransactions((prev) => [txn, ...prev]);
    const updatedUser = {
      ...user,
      balance: user.balance + amount - fee,
      totalDeposits: user.totalDeposits + amount,
    };
    setUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    toast.success(`KES ${amount.toLocaleString()} deposited successfully`);
  }, [user]);

  const withdraw = useCallback((amount: number, method: "mpesa" | "card") => {
    if (!user) return;
    const fee = calculateFee(amount, "withdrawal");
    if (amount + fee > user.balance) {
      toast.error("Insufficient balance");
      return;
    }
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      userId: user.id,
      userName: user.name,
      type: "withdrawal",
      method,
      amount,
      fee,
      status: "completed",
      reference: generateTransactionId(),
    };
    setTransactions((prev) => [txn, ...prev]);
    const updatedUser = {
      ...user,
      balance: user.balance - amount - fee,
      totalWithdrawn: user.totalWithdrawn + amount,
    };
    setUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    toast.success(`KES ${amount.toLocaleString()} withdrawn successfully`);
  }, [user]);

  const transfer = useCallback((amount: number, recipientPhone: string) => {
    if (!user) return;
    const fee = calculateFee(amount, "transfer");
    if (amount + fee > user.balance) {
      toast.error("Insufficient balance");
      return;
    }
    const recipient = users.find((u) => u.phone === recipientPhone);
    if (!recipient) {
      toast.error("Recipient not found");
      return;
    }
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      userId: user.id,
      userName: user.name,
      type: "transfer",
      amount,
      fee,
      status: "completed",
      reference: generateTransactionId(),
    };
    setTransactions((prev) => [txn, ...prev]);
    const updatedUser = {
      ...user,
      balance: user.balance - amount - fee,
      totalTransfers: user.totalTransfers + amount,
    };
    const updatedRecipient = { ...recipient, balance: recipient.balance + amount };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === user.id) return updatedUser;
        if (u.id === recipient.id) return updatedRecipient;
        return u;
      })
    );
    toast.success(`KES ${amount.toLocaleString()} sent to ${recipient.name}`);
  }, [user, users]);

  const chargeStatementDownload = useCallback((): boolean => {
    if (!user) return false;
    if (user.balance < STATEMENT_DOWNLOAD_FEE) {
      toast.error("Insufficient balance for statement download (KES 50)");
      return false;
    }
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      userId: user.id,
      userName: user.name,
      type: "withdrawal",
      amount: STATEMENT_DOWNLOAD_FEE,
      fee: 0,
      status: "completed",
      reference: generateTransactionId(),
    };
    setTransactions((prev) => [txn, ...prev]);
    const updatedUser = { ...user, balance: user.balance - STATEMENT_DOWNLOAD_FEE };
    setUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));
    toast.success("Statement downloaded. KES 50 deducted.");
    return true;
  }, [user]);

  const updateUser = useCallback((userId: string, updates: Partial<DemoUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (user?.id === userId) {
      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, transactions, login, logout, deposit, withdraw, transfer, chargeStatementDownload, allUsers: users, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
