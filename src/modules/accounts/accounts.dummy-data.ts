import type { Accounts, CreditCardAccount } from "./accounts.model";

// dummy accounts, loaded by accountsServices.load() while the database is switched off.
// the ids match the dummy transactions in modules/transactions/transaction-mock-data.ts

export const DUMMY_ACCOUNTS: Accounts[] = [
  {
    id: "acc-phonepe",
    name: "PhonePe",
    type: "digital-wallet",
    openingBalance: 14414,
    color: "#3454F5",
    status: "active",
  },
  {
    id: "acc-hdfc-savings",
    name: "HDFC Savings",
    type: "bank",
    openingBalance: 65498,
    color: "#10B981",
    status: "active",
  },
  {
    id: "acc-cash",
    name: "Cash Wallet",
    type: "cash",
    openingBalance: 4200,
    color: "#EAA900",
    status: "active",
  },
  {
    id: "acc-sbi-old",
    name: "Old SBI Savings",
    type: "bank",
    openingBalance: 1200,
    color: "#64748B",
    status: "archived",
  },
];

export const DUMMY_CREDIT_CARDS: CreditCardAccount[] = [
  {
    id: "cc-hdfc-millennia",
    name: "HDFC Millennia",
    type: "credit-card",
    outstandingBalance: 5575,
    currentStatementAmount: 5575,
    totalDueAmount: 5575,
    creditLimit: 224245,
    statementDate: 1,
    paymentDueDate: 1,
    color: "#243B64",
    status: "active",
  },
  {
    id: "cc-amazon-pay",
    name: "Amazon Pay Card",
    type: "credit-card",
    outstandingBalance: 343,
    currentStatementAmount: 343,
    totalDueAmount: 343,
    creditLimit: 100000,
    statementDate: 10,
    paymentDueDate: 5,
    color: "#4B2A5D",
    status: "active",
  },
];
