import { createSlice } from "@reduxjs/toolkit";
import type { Transaction } from "./transaction.model";
import { DEFAULT_TRANSACTION_FILTERS } from "./transactions.constants";
import { transactions as DUMMY_TRANSACTIONS } from "./transaction-mock-data";

const initialState = {
  // dummy transactions until they come from the db like the accounts
  transactions: DUMMY_TRANSACTIONS as Transaction[],
  filters: DEFAULT_TRANSACTION_FILTERS,
};
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    transactionAdded(state, action) {
      const { newTransaction } = action.payload;
      state.transactions.push(newTransaction);
    },
    transactionUpdated(state, action) {
      const { id, updatedTrans } = action.payload;
      state.transactions = state.transactions.map((trans) =>
        trans.id !== id ? trans : { ...trans, ...updatedTrans },
      );
    },
    transactionRemoved(state, action) {
      const { id } = action.payload;
      state.transactions = state.transactions.filter(
        (trans) => trans.id !== id,
      );
    },

    // filter
    filtersUpdated(state, action) {
      const { updates } = action.payload;
      state.filters = { ...state.filters, ...updates };
    },
    filtersReset(state) {
      state.filters = DEFAULT_TRANSACTION_FILTERS;
    },
  },
});

export const {
  transactionAdded,
  transactionRemoved,
  transactionUpdated,
  filtersUpdated,
  filtersReset,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
