export type UserRole = "user" | "agent" | "admin";

export interface DemoUser {
  id: string;
  phone: string;
  password: string;
  name: string;
  role: UserRole;
  walletId: string;
  balance: number;
  totalDeposits: number;
  totalWithdrawn: number;
  totalTransfers: number;
  kycStatus: "pending" | "approved" | "rejected";
}

export interface Transaction {
  id: string;
  date: string;
  userId: string;
  userName: string;
  type: "deposit" | "withdrawal" | "transfer" | "kyc_update" | "airtime" | "send_money";
  method?: "mpesa" | "card";
  amount: number;
  fee: number;
  status: "completed" | "successful" | "pending" | "failed";
  reference: string;
}

export interface FeeConfig {
  id: string;
  transactionType: string;
  feeType: "percentage" | "fixed";
  feeAmount: number;
  active: boolean;
}

export interface CommissionConfig {
  id: string;
  commissionType: string;
  rate: number;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: "usr-001",
    phone: "0700000001",
    password: "user1234",
    name: "John Doe",
    role: "user",
    walletId: "WLT-2024-0001",
    balance: 15000,
    totalDeposits: 45200,
    totalWithdrawn: 28300,
    totalTransfers: 12500,
    kycStatus: "approved",
  },
  {
    id: "usr-002",
    phone: "0700000002",
    password: "agent1234",
    name: "Sarah Kamau",
    role: "agent",
    walletId: "WLT-2024-0002",
    balance: 85000,
    totalDeposits: 250000,
    totalWithdrawn: 180000,
    totalTransfers: 95000,
    kycStatus: "approved",
  },
  {
    id: "usr-003",
    phone: "0700000003",
    password: "admin1234",
    name: "Admin",
    role: "admin",
    walletId: "WLT-2024-0003",
    balance: 0,
    totalDeposits: 0,
    totalWithdrawn: 0,
    totalTransfers: 0,
    kycStatus: "approved",
  },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    date: "2024-02-10 14:23",
    userId: "usr-001",
    userName: "John Doe",
    type: "deposit",
    method: "mpesa",
    amount: 5000,
    fee: 75,
    status: "completed",
    reference: "TXN-20240210-001",
  },
  {
    id: "txn-002",
    date: "2024-02-09 11:05",
    userId: "usr-001",
    userName: "John Doe",
    type: "withdrawal",
    method: "mpesa",
    amount: 3000,
    fee: 100,
    status: "completed",
    reference: "TXN-20240209-001",
  },
  {
    id: "txn-003",
    date: "2024-02-09 09:30",
    userId: "usr-002",
    userName: "Sarah Kamau",
    type: "deposit",
    method: "card",
    amount: 50000,
    fee: 750,
    status: "successful",
    reference: "TXN-20240209-002",
  },
  {
    id: "txn-004",
    date: "2024-02-08 16:45",
    userId: "usr-001",
    userName: "John Doe",
    type: "transfer",
    amount: 2500,
    fee: 45,
    status: "completed",
    reference: "TXN-20240208-001",
  },
  {
    id: "txn-005",
    date: "2024-02-10 10:00",
    userId: "usr-001",
    userName: "Jane Mwangi",
    type: "withdrawal",
    method: "mpesa",
    amount: 20000,
    fee: 100,
    status: "completed",
    reference: "TXN-20240210-002",
  },
  {
    id: "txn-006",
    date: "2024-02-09 08:15",
    userId: "usr-002",
    userName: "Paul Kimani",
    type: "deposit",
    method: "mpesa",
    amount: 50000,
    fee: 750,
    status: "successful",
    reference: "TXN-20240209-003",
  },
  {
    id: "txn-007",
    date: "2024-02-08 14:00",
    userId: "usr-001",
    userName: "Account Review",
    type: "kyc_update",
    amount: 0,
    fee: 0,
    status: "pending",
    reference: "TXN-20240208-002",
  },
  {
    id: "txn-008",
    date: "2024-02-07 12:30",
    userId: "usr-001",
    userName: "Alice Otieno",
    type: "transfer",
    amount: 15000,
    fee: 270,
    status: "failed",
    reference: "TXN-20240207-001",
  },
];

export const DEMO_FEES: FeeConfig[] = [
  { id: "fee-1", transactionType: "Deposit", feeType: "percentage", feeAmount: 1.5, active: false },
  { id: "fee-2", transactionType: "Withdrawal", feeType: "fixed", feeAmount: 100, active: true },
  { id: "fee-3", transactionType: "Bank Transfer", feeType: "percentage", feeAmount: 2.0, active: false },
  { id: "fee-4", transactionType: "Mobile Money Transfer", feeType: "percentage", feeAmount: 1.8, active: false },
];

export const DEMO_COMMISSIONS: CommissionConfig[] = [
  { id: "com-1", commissionType: "Referral Bonus", rate: 10 },
  { id: "com-2", commissionType: "Load Wallet Commission", rate: 2 },
  { id: "com-3", commissionType: "Transaction Commission", rate: 1 },
];

export const ADMIN_STATS = {
  totalWalletBalance: 2500000,
  totalDeposits: 8900000,
  totalWithdrawn: 6750000,
  pendingKYC: 15,
  activeUsers: 1250,
  activeAgents: 48,
  systemAlerts: 3,
};

export const DEMO_OTP = "123456";

export function generateTransactionId(): string {
  const date = new Date();
  const d = date.toISOString().slice(0, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, "0");
  return `TXN-${d}-${seq}`;
}

export function calculateFee(amount: number, type: "deposit" | "withdrawal" | "transfer"): number {
  const feeMap: Record<string, { type: string; amount: number }> = {
    deposit: { type: "percentage", amount: 1.5 },
    withdrawal: { type: "fixed", amount: 100 },
    transfer: { type: "percentage", amount: 1.8 },
  };
  const fee = feeMap[type];
  if (fee.type === "percentage") return Math.round((amount * fee.amount) / 100);
  return fee.amount;
}

export const STATEMENT_DOWNLOAD_FEE = 50;
