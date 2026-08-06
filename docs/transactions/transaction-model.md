```
type Transaction = {
  id: string;

  type: "income" | "expense" | "transfer" | "payment";

  title: string;

  amount: number;

  transactionDate: string;

  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;

  categoryId?: string;
  subCategoryId?: string;

  recurringTransactionId?: string;

  note?: string;

  isDeleted: boolean;
  deletedAt?: string;

  createdAt: string;
  updatedAt: string;
};
```