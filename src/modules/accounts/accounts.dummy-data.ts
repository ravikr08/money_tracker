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
    // opening outstanding. with the 4,734 spent on the card in the dummy transactions this is 5,575 owed now
    outstandingBalance: 841,
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
    // opening outstanding. 2,000 + 1,200 (6 Sep) = 3,200 owed before the 3,000 payment of 15 Oct, so the payment is not more than what is owed,
    // then + 2,349 (21 Oct) = 2,549 owed now
    outstandingBalance: 2000,
    creditLimit: 100000,
    statementDate: 10,
    paymentDueDate: 5,
    color: "#4B2A5D",
    status: "active",
  },
];
