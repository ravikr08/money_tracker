import type { Transaction, TransactionTypes } from "./transaction.model";
import { DEFAULT_CATEGORIES, DEFAULT_SUBCATEGORIES_MAP } from "@/modules/category/category.constants";

// dummy transactions for now. the account ids are the ones in modules/accounts/accounts.dummy-data.ts,
// the category ids are looked up by name so they always match the ones in category.constants.ts.
// they add up to the numbers of the transactions design: income 85,340, expense 10,240, 14 in total

const categoryId = (name: string) => DEFAULT_CATEGORIES.find((cat) => cat.name === name)!.id;
const subCategoryId = (name: string) =>
  Object.values(DEFAULT_SUBCATEGORIES_MAP).flat().find((sub) => sub.name === name)!.id;

type Dummy = {
  type: TransactionTypes;
  title: string;
  amount: number;
  date: string; // yyyy-mm-dd
  time: string; // hh:mm
  category: string;
  subcategory?: string;
  from?: string;
  to?: string;
  note?: string;
};

const DUMMY: Dummy[] = [
  { type: "income", title: "Salary · Acme Corp", amount: 72000, date: "2026-10-24", time: "09:05", category: "Salary", to: "acc-hdfc-savings", note: "October salary" },
  { type: "expense", title: "Swiggy", amount: 486, date: "2026-10-24", time: "13:12", category: "Food", subcategory: "Restaurants", from: "cc-hdfc-millennia", note: "Team lunch" },
  { type: "transfer", title: "Wallet top-up", amount: 5000, date: "2026-10-23", time: "11:20", category: "Transfer", from: "acc-hdfc-savings", to: "acc-phonepe" },
  { type: "expense", title: "Uber", amount: 312, date: "2026-10-23", time: "20:40", category: "Transport", subcategory: "Cab", from: "acc-phonepe" },
  { type: "expense", title: "Doctor consultation", amount: 1820, date: "2026-10-21", time: "10:15", category: "Healthcare", from: "acc-hdfc-savings" },
  { type: "expense", title: "Amazon", amount: 2349, date: "2026-10-21", time: "18:02", category: "Shopping", from: "cc-amazon-pay", note: "Headphones" },
  { type: "income", title: "Freelance payout", amount: 12500, date: "2026-10-19", time: "16:30", category: "Freelance", to: "acc-phonepe", note: "Logo project" },
  { type: "expense", title: "Netflix", amount: 649, date: "2026-10-19", time: "07:00", category: "Entertainment", from: "cc-hdfc-millennia" },
  { type: "expense", title: "BigBasket", amount: 1264, date: "2026-10-15", time: "18:45", category: "Food", subcategory: "Groceries", from: "acc-phonepe", note: "Weekly groceries" },
  { type: "payment", title: "Card bill payment", amount: 3000, date: "2026-10-15", time: "12:00", category: "Credit Card Payment", from: "acc-hdfc-savings", to: "cc-amazon-pay" },
  { type: "income", title: "Refund · Myntra", amount: 840, date: "2026-10-12", time: "15:10", category: "Refund", to: "acc-hdfc-savings" },
  { type: "expense", title: "Apollo Pharmacy", amount: 960, date: "2026-10-10", time: "19:25", category: "Healthcare", from: "acc-cash" },
  { type: "expense", title: "Udemy course", amount: 1499, date: "2026-10-08", time: "21:00", category: "Education", from: "cc-hdfc-millennia" },
  { type: "expense", title: "Pet food", amount: 901, date: "2026-10-05", time: "11:30", category: "Pets", from: "acc-cash" },
  // last month, so the dashboard has something to compare with: income 72,000 and expense 4,599
  { type: "income", title: "Salary · Acme Corp", amount: 72000, date: "2026-09-24", time: "09:05", category: "Salary", to: "acc-hdfc-savings", note: "September salary" },
  { type: "expense", title: "Zomato", amount: 2100, date: "2026-09-18", time: "20:10", category: "Food", subcategory: "Restaurants", from: "cc-hdfc-millennia" },
  { type: "expense", title: "Metro card", amount: 1299, date: "2026-09-12", time: "08:30", category: "Transport", from: "acc-phonepe" },
  { type: "expense", title: "Clothes", amount: 1200, date: "2026-09-06", time: "17:45", category: "Shopping", from: "cc-amazon-pay" },
];

export const transactions: Transaction[] = DUMMY.map((d, i) => {
  const stamp = `${d.date}T${d.time}:00.000Z`;
  return {
    id: `txn-${String(i + 1).padStart(3, "0")}`,
    type: d.type,
    title: d.title,
    amount: d.amount,
    transactionDate: d.date,
    fromAccountId: d.from,
    toAccountId: d.to,
    categoryId: categoryId(d.category),
    subCategoryId: d.subcategory ? subCategoryId(d.subcategory) : undefined,
    note: d.note,
    isDeleted: false,
    createdAt: stamp,
    updatedAt: stamp,
  };
});
