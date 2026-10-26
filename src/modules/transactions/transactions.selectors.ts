import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/app.store";
import { transactionServices } from "./transaction.services";
import {
  buildTransactionQuery,
  formatPeriodRange,
  groupTransactions,
  summarizeTransactions,
} from "./transactions.utils";

export const selectTransactions = (state: RootState) =>
  state.transactionsSlice.transactions;
export const selectTransactionFilters = (state: RootState) =>
  state.transactionsSlice.filters;

// the list the toolbar filters give. createSelector returns the same array
// until the transactions or the filters really change, so components don't re-render for nothing
export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectTransactionFilters],
  (transactions, filters) =>
    transactionServices.filterTransactions(
      transactions,
      buildTransactionQuery(filters),
    ),
);

export const selectTransactionGroups = createSelector(
  [selectFilteredTransactions, (state: RootState) => state.transactionsSlice.filters.view],
  (transactions, view) => groupTransactions(transactions, view),
);

export const selectTransactionSummary = createSelector(
  [selectFilteredTransactions],
  summarizeTransactions,
);

// a string, so the component only re-renders when the text changes
export const selectPeriodRangeLabel = (state: RootState) =>
  formatPeriodRange(state.transactionsSlice.filters.period);

// id -> name, so a row can show "Food › Restaurants" and "HDFC Savings" for the ids it stores
export const selectCategoryNames = createSelector(
  [(state: RootState) => state.categorySlice.categories],
  (categories) => Object.fromEntries(categories.map((c) => [c.id, c.name])),
);
export const selectSubCategoryNames = createSelector(
  [(state: RootState) => state.categorySlice.subcategoriesMap],
  (map) =>
    Object.fromEntries(
      Object.values(map)
        .flat()
        .map((s) => [s.id, s.name]),
    ),
);
export const selectAccountNames = createSelector(
  [
    (state: RootState) => state.accountsSlice.accounts,
    (state: RootState) => state.accountsSlice.creditCards,
  ],
  (accounts, cards) =>
    Object.fromEntries([...accounts, ...cards].map((a) => [a.id, a.name])),
);
