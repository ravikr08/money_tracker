export type Transaction = {
  id: string;

  type: TransactionTypes;

  title?: string;

  amount: number;

  transactionDate: string;

  fromAccountId?: string;
  toAccountId?: string;

  categoryId: string;
  subCategoryId?: string;

  recurringTransactionId?: string;

  note?: string;

  // archived transactions stay in the list (dimmed) but are left out of the totals
  isArchived?: boolean;

  isDeleted: boolean;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
};

export type TransactionTypes = "income" | "expense" | "transfer" | "payment";

export type TransactionFilter = {
  id?: string;
  type?: TransactionTypes;
  title?: string; // case-insensitive substring match
  search?: string; // case-insensitive substring match on title or note
  categoryId?: string;
  subCategoryId?: string;
  accountId?: string; // matches either fromAccountId or toAccountId
  from?: Date | string; // inclusive
  to?: Date | string; // inclusive
  amountMin?: number; // inclusive
  amountMax?: number; // inclusive
};

export type ViewKey = "daily" | "weekly" | "monthly" | "calendar";

export type PeriodKey =
  | "today"
  | "last7"
  | "last30"
  | "thisMonth"
  | "lastMonth"
  | "thisYear";

// what the toolbar has applied. "all" means no filter, the real query is built from this
export type TransactionFiltersState = {
  view: ViewKey;
  period: PeriodKey;
  type: "all" | TransactionTypes;
  accountId: string;
  categoryId: string;
  search: string;
  amountMin: number | null;
  amountMax: number | null;
};
