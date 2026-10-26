import { appStore } from "@/app/app.store";
import { parseLocalDate } from "./transactions.utils";
import * as transactionActions from "./transactions.slice";
import type {
  Transaction,
  TransactionFilter,
  TransactionFiltersState,
} from "./transaction.model";

const transactionStore = {
  get() {
    return appStore.getState().transactionsSlice;
  },
  dispatch: appStore.dispatch,
};

export const transactionServices = {
  getAllTransactions() {
    const { transactions } = transactionStore.get();
    return transactions.filter((t) => !t.isDeleted);
  },

  getTransactionById(id: string) {
    return this.getAllTransactions().find((t) => t.id === id);
  },

  getFilteredTransactions(filter: TransactionFilter = {}) {
    return this.filterTransactions(this.getAllTransactions(), filter);
  },

  filterTransactions(list: Transaction[], filter: TransactionFilter = {}) {
    const title = filter.title?.toLowerCase();
    const search = filter.search?.toLowerCase();
    const from = filter.from ? parseLocalDate(filter.from).getTime() : undefined;
    const to = filter.to ? parseLocalDate(filter.to).getTime() : undefined;

    return list.filter((t) => {
      if (t.isDeleted) return false;
      if (filter.id && t.id !== filter.id) return false;
      if (filter.type && t.type !== filter.type) return false;
      if (filter.categoryId && t.categoryId !== filter.categoryId) return false;
      if (filter.subCategoryId && t.subCategoryId !== filter.subCategoryId)
        return false;
      if (
        filter.accountId &&
        t.fromAccountId !== filter.accountId &&
        t.toAccountId !== filter.accountId
      )
        return false;
      if (title && !t.title?.toLowerCase().includes(title)) return false;
      if (
        search &&
        !t.title?.toLowerCase().includes(search) &&
        !t.note?.toLowerCase().includes(search)
      )
        return false;
      if (filter.amountMin !== undefined && t.amount < filter.amountMin)
        return false;
      if (filter.amountMax !== undefined && t.amount > filter.amountMax)
        return false;

      if (from !== undefined || to !== undefined) {
        const date = parseLocalDate(t.transactionDate).getTime();
        if (from !== undefined && date < from) return false;
        if (to !== undefined && date > to) return false;
      }
      return true;
    });
  },

  addTransaction(data: Omit<Transaction, "id" | "isDeleted" | "createdAt" | "updatedAt"> & { createdAt?: string }) {
    const now = new Date().toISOString();
    transactionStore.dispatch(
      transactionActions.transactionAdded({
        newTransaction: {
          ...data,
          id: crypto.randomUUID(),
          isDeleted: false,
          createdAt: data.createdAt ?? now,
          updatedAt: now,
        },
      }),
    );
  },

  // changes the given fields of a transaction and stamps updatedAt
  updateTransaction(id: string, changes: Partial<Transaction>) {
    transactionStore.dispatch(
      transactionActions.transactionUpdated({
        id,
        updatedTrans: { ...changes, updatedAt: new Date().toISOString() },
      }),
    );
  },

  archiveTransaction(id: string) {
    this.updateTransaction(id, { isArchived: true });
  },

  restoreTransaction(id: string) {
    this.updateTransaction(id, { isArchived: false });
  },

  // soft delete: the transaction stays in the list with isDeleted, the getters and filters skip it
  deleteTransaction(id: string) {
    const now = new Date().toISOString();
    transactionStore.dispatch(
      transactionActions.transactionUpdated({
        id,
        updatedTrans: { isDeleted: true, deletedAt: now, updatedAt: now },
      }),
    );
  },

  // filters
  getFilters() {
    return transactionStore.get().filters;
  },

  updateFilters(obj: Partial<TransactionFiltersState>) {
    transactionStore.dispatch(
      transactionActions.filtersUpdated({ updates: obj }),
    );
  },

  resetFilters() {
    transactionStore.dispatch(transactionActions.filtersReset());
  },
};
