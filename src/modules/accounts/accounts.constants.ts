import { Dialog, Drawer } from "@base-ui/react";
import { Banknote, CreditCard, Landmark, Smartphone, type LucideIcon } from "lucide-react";
import type {
  AccountFormValues,
  Accounts,
  AccountsDialogPayload,
  AccountsDrawerPayload,
  AccountsStatusFilter,
  CreditCardAccount,
  CreditCardFormValues,
} from "./accounts.model";

export const ACCOUNTS_DIALOG_HANLDE = Dialog.createHandle<AccountsDialogPayload>();
export const ACCOUNTS_DRAWER_HANDLE = Drawer.createHandle<AccountsDrawerPayload>();

export const AVAILABLE_ACCOUNT_COLORS = [
  "#3454F5",
  "#10B981",
  "#EAA900",
  "#20A4D8",
  "#FF646B",
  "#8B7CF6",
  "#64748B",
  "#FF963D",
];

// credit cards use darker colours
export const AVAILABLE_CREDIT_CARD_COLORS = [
  "#4B2A5D",
  "#243B64",
  "#315B52",
  "#5A2D3B",
  "#2E3B4E",
  "#4A3B2A",
];

export const ACCOUNT_TYPE_OPTIONS: { value: Accounts["type"]; label: string; icon: LucideIcon }[] = [
  { value: "bank", label: "Bank Account", icon: Landmark },
  { value: "cash", label: "Cash Wallet", icon: Banknote },
  { value: "digital-wallet", label: "Digital Wallet", icon: Smartphone },
];

export const ACCOUNT_STATUS_OPTIONS: { value: AccountsStatusFilter; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export const createInitialAccount = (): AccountFormValues => ({
  name: "",
  type: "bank",
  openingBalance: "",
  color: AVAILABLE_ACCOUNT_COLORS[0],
});

export const createInitialCreditCard = (): CreditCardFormValues => ({
  name: "",
  creditLimit: "",
  outstandingBalance: "",
  statementDate: "1",
  paymentDueDate: "1",
  color: AVAILABLE_CREDIT_CARD_COLORS[0],
});

export const AccountsTypeIconMap: Record<string, LucideIcon> = {
  "digital-wallet": Smartphone,
  cash: Banknote,
  bank: Landmark,
  "credit-card": CreditCard,
};

export const AccountsTypeNameMap = {
  "digital-wallet": "Digital Wallet",
  cash: "Cash",
  bank: "Bank Account",
  "credit-card": "Credit Card",
};

export const accounts: Accounts[] = [
  {
    id: "acc-001",
    name: "Cash Wallet",
    type: "cash",
    openingBalance: 4200,
    color: "#F59E0B",
    status: "active",
  },
  {
    id: "acc-002",
    name: "Checking Account",
    type: "bank",
    openingBalance: 82450,
    color: "#6366F1",
    status: "active",
  },
  {
    id: "acc-003",
    name: "Paytm UPI",
    type: "digital-wallet",
    openingBalance: 3150,
    color: "#0EA5E9",
    status: "active",
  },
  {
    id: "acc-004",
    name: "Savings Account",
    type: "bank",
    openingBalance: 346000,
    color: "#10B981",
    status: "active",
  },
];

export const creditCardAccounts: CreditCardAccount[] = [
  {
    id: "cc-001",
    name: "Visa Signature",
    type: "credit-card",

    outstandingBalance: 18500,

    creditLimit: 150000,
    statementDate: 10,
    paymentDueDate: 5,

    color: "#4B2A5D",
    status: "active",
  },
  {
    id: "cc-002",
    name: "Millennia Credit Card",
    type: "credit-card",

    outstandingBalance: 32400,

    creditLimit: 100000,
    statementDate: 15,
    paymentDueDate: 3,

    color: "#243B64",
    status: "active",
  },
  {
    id: "cc-003",
    name: "Amazon Pay Card",
    type: "credit-card",

    outstandingBalance: 8750,

    creditLimit: 75000,
    statementDate: 20,
    paymentDueDate: 8,

    color: "#315B52",
    status: "active",
  },
];