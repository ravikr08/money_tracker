import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "@/modules/category/category.slice";
import accountsReducer from "@/modules/accounts/accounts.slice";
import transactionsReducer from "@/modules/transactions/transactions.slice";

export const appStore = configureStore({
  reducer: {
    categorySlice: categoryReducer,
    accountsSlice: accountsReducer,
    transactionsSlice: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
