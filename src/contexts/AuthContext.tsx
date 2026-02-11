import React, { createContext, useContext, useState, useCallback } from "react";
import { DemoUser, DEMO_USERS, Transaction, DEMO_TRANSACTIONS, generateTransactionId, calculateFee, STATEMENT_DOWNLOAD_FEE } from "@/lib/demo-data";
import { toast } from "sonner";

interface ProcessTransactionInput {
  type: Transaction["type"];
  method?: "mpesa" | "card";
  amount: number;
  fee: number;
  reference: string;
  recipientPhone?: string;
  targetUserId?: string;
}

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
  processTransaction: (input: ProcessTransactionInput) => void;
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

  const processTransaction = useCallback((input: ProcessTransactionInput) => {
    if (!user) return;
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      userId: user.id,
      userName: user.name,
      type: input.type,
      method: input.method,
      amount: input.amount,
      fee: input.fee,
      status: "completed",
      reference: input.reference,
    };
    setTransactions((prev) => [txn, ...prev]);

    let balanceChange = 0;
    if (input.type === "deposit") {
      // If agent depositing to a target user
      if (input.targetUserId) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === input.targetUserId
              ? { ...u, balance: u.balance + input.amount, totalDeposits: u.totalDeposits + input.amount }
              : u
          )
        );
        toast.success(`KES ${input.amount.toLocaleString()} deposited successfully`);
        return;
      }
      balanceChange = input.amount - input.fee;
    } else if (input.type === "withdrawal" || input.type === "send_money" || input.type === "airtime" || input.type === "transfer") {
      balanceChange = -(input.amount + input.fee);
    }

    const updatedUser = {
      ...user,
      balance: user.balance + balanceChange,
      totalDeposits: input.type === "deposit" ? user.totalDeposits + input.amount : user.totalDeposits,
      totalWithdrawn: input.type === "withdrawal" ? user.totalWithdrawn + input.amount : user.totalWithdrawn,
      totalTransfers: (input.type === "transfer" || input.type === "send_money") ? user.totalTransfers + input.amount : user.totalTransfers,
    };
    setUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)));

    // Credit recipient for send_money
    if (input.type === "send_money" && input.recipientPhone) {
      const recipient = users.find((u) => u.phone === input.recipientPhone);
      if (recipient) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === recipient.id ? { ...u, balance: u.balance + input.amount } : u
          )
        );
      }
    }

    const typeLabel = input.type === "airtime" ? "Airtime purchased" :
      input.type === "send_money" ? "Money sent" :
      input.type === "withdrawal" ? "Withdrawal" :
      input.type === "deposit" ? "Deposit" : "Transaction";
    toast.success(`${typeLabel} — KES ${input.amount.toLocaleString()}`);
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
      value={{ user, transactions, login, logout, deposit, withdraw, transfer, chargeStatementDownload, allUsers: users, updateUser, processTransaction }}
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
