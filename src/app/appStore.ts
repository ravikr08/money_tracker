import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "@/modules/category/category.slice";

export const appStore = configureStore({
  reducer: {
    categorySlice: categoryReducer,
  },
});
