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

  isDeleted: boolean;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
};

export type TransactionTypes = "income" | "expense" | "transfer" | "payment";

