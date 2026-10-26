import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_INITIAL_FILTERS,
  DEFAULT_SUBCATEGORIES_MAP,
} from "./category.constants";
import type { Category, SubCategoryMap } from "./category.model";

// copies so the default constants themselves don't get frozen by immer
const initialState = {
  categories: DEFAULT_CATEGORIES.map((cat) => ({ ...cat })) as Category[],
  subcategoriesMap: structuredClone(
    DEFAULT_SUBCATEGORIES_MAP,
  ) as SubCategoryMap,
  filters: DEFAULT_INITIAL_FILTERS,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    // category
    categoryAdded(state, action) {
      const { newCat } = action.payload;

      state.categories.unshift(newCat);
    },
    categoryUpdated(state, action) {
      const { updatedCat, id } = action.payload;
      state.categories = state.categories.map((el) =>
        el.id !== id ? el : { ...el, ...updatedCat },
      );
    },
    categoriesArchived(state, action) {
      const ids = new Set(action.payload.ids);
      state.categories.forEach((category) => {
        if (ids.has(category.id)) {
          category.status = "archived";
        }
      });
    },
    categoriesRestored(state, action) {
      const ids = new Set(action.payload.ids);
      state.categories.forEach((category) => {
        if (ids.has(category.id)) {
          category.status = "active";
        }
      });
    },
    categoriesRemoved(state, action) {
      const ids = new Set(action.payload.ids);
      state.categories.forEach((category) => {
        if (ids.has(category.id)) {
          category.status = "deleted";
        }
      });
    },
    // subcategory
    subCategoryAdded(state, action) {
      const { newSubCat } = action.payload;
      if (state.subcategoriesMap[newSubCat.categoryId]) {
        state.subcategoriesMap[newSubCat.categoryId].unshift(newSubCat);
      } else {
        state.subcategoriesMap[newSubCat.categoryId] = [newSubCat];
      }
    },
    subCategoryUpdated(state, action) {
      const { updatedSubCat, id, categoryId } = action.payload;
      state.subcategoriesMap[categoryId] = state.subcategoriesMap[
        categoryId
      ].map((el) => (el.id !== id ? el : { ...el, ...updatedSubCat }));
    },

    subcategoryArchived(state, action) {
      const id = action.payload.id;
      const catid = action.payload.catId;
      state.subcategoriesMap[catid].forEach((subcat) => {
        if (id === subcat.id) {
          subcat.status = "archived";
        }
      });
    },
    subcategoryRestored(state, action) {
      const id = action.payload.id;
      const catid = action.payload.catId;
      state.subcategoriesMap[catid].forEach((subcat) => {
        if (id === subcat.id) {
          subcat.status = "active";
        }
      });
    },
    subcategoryRemoved(state, action) {
      const { id, catId } = action.payload;
      state.subcategoriesMap[catId].forEach((subcat) => {
        if (id === subcat.id) {
          subcat.status = "deleted";
        }
      });
    },

    // filter
    filtersUpdated(state, action) {
      const { updates } = action.payload;
      state.filters = { ...state.filters, ...updates };
    },
  },
});

export const {
  categoryAdded,
  categoryUpdated,
  categoriesArchived,
  categoriesRestored,
  categoriesRemoved,
  subCategoryAdded,
  subCategoryUpdated,
  subcategoryArchived,
  subcategoryRestored,
  subcategoryRemoved,
  filtersUpdated,
} = categorySlice.actions;

export default categorySlice.reducer;
