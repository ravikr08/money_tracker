import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_INITIAL_FILTERS,
  DEFAULT_SUBCATEGORIES_MAP,
} from "./category.contansts";

const initialState = {
  categories: DEFAULT_CATEGORIES,
  subcategoriesMap: DEFAULT_SUBCATEGORIES_MAP,
  filters: DEFAULT_INITIAL_FILTERS,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    categoryAdded(state, action) {
      const { newcat } = action.payload;
      state.categories.unshift(newcat);
    },
    categoryUpdated(state, action) {
      const { updatedCat, prevId } = action.payload;
      state.categories = state.categories.map((el) =>
        el.id !== prevId ? el : updatedCat,
      );
    },
    subCategoryAdded(state, action) {
      const { newSubCat } = action.payload;
      state.subcategoriesMap[newSubCat.categoryId].unshift(newSubCat);
    },
    subCategoryUpdated(state, action) {
      const { updatedSubCat, oldSubCatId } = action.payload;
      state.subcategoriesMap[updatedSubCat.categoryId] = state.subcategoriesMap[
        updatedSubCat.categoryId
      ].map((el) => (el.id !== oldSubCatId ? el : updatedSubCat));
    },
    filtersUpdated(state, action) {
      const { filters } = action.payload;
      state.filters = { ...state.filters, ...filters };
    },
  },
});

export const {
  categoryAdded,
  categoryUpdated,
  subCategoryAdded,
  subCategoryUpdated,
  filtersUpdated,
} = categorySlice.actions;

export default categorySlice.reducer;
