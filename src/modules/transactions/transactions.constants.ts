import { Dialog, Drawer } from "@base-ui/react";
import type {
  PeriodKey,
  TransactionFiltersState,
  TransactionTypes,
  ViewKey,
} from "./transaction.model";

// the details panel of a transaction. the payload is the id of the transaction to show
export const TRANSACTION_DRAWER_HANDLE = Drawer.createHandle<{ id: string }>();
// the edit form and the delete question are dialogs, they get the id of the transaction the same way.
// the form is also the "new transaction" one: no id = a new transaction
export const TRANSACTION_EDIT_HANDLE = Dialog.createHandle<{ id?: string }>();
export const TRANSACTION_DELETE_HANDLE = Dialog.createHandle<{ id: string }>();

export const VIEW_OPTIONS: { value: ViewKey; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "calendar", label: "Calendar" },
];

export const PERIOD_OPTIONS: { value: PeriodKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "thisMonth", label: "This month" },
  { value: "lastMonth", label: "Last month" },
  { value: "thisYear", label: "This year" },
];

export const TYPE_OPTIONS: {
  value: "all" | TransactionTypes;
  label: string;
}[] = [
  { value: "all", label: "All types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "transfer", label: "Transfer" },
  { value: "payment", label: "Card payment" },
];

export const DEFAULT_TRANSACTION_FILTERS: TransactionFiltersState = {
  view: "daily",
  period: "thisMonth",
  type: "all",
  accountId: "all",
  categoryId: "all",
  search: "",
  amountMin: null,
  amountMax: null,
};
