import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "@/modules/category/category.slice";
import accountsReducer from "@/modules/accounts/accounts.slice";

export const appStore = configureStore({
  reducer: {
    categorySlice: categoryReducer,
    accountsSlice: accountsReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
