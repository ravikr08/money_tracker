import { create } from "zustand";
import type { CategoryStore } from "./category.model";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_INITIAL_FILTERS,
  DEFAULT_SUBCATEGORIES_MAP,
} from "./category.contansts";

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: DEFAULT_CATEGORIES,
  subCategoriesMap: DEFAULT_SUBCATEGORIES_MAP,
  //   Actions
  addNewCategory: (newCat) =>
    set((state) => ({ categories: [newCat, ...state.categories] })),
  updateCategory: (updatedCat, oldId) =>
    set((state) => {
      return {
        categories: state.categories.map((el) => {
          if (el.id === oldId) {
            return updatedCat;
          } else {
            return el;
          }
        }),
      };
    }),
  addNewSubCategory: (newSubCat, catId) =>
    set((state) => ({
      subCategoriesMap: {
        ...state.subCategoriesMap,
        [catId]: [newSubCat, ...(state.subCategoriesMap[catId] ?? [])],
      },
    })),
  updateSubCategory: (updatedSubCategory, oldSubCatId) =>
    set((state) => {
      return {
        subCategoriesMap: {
          ...state.subCategoriesMap,
          [updatedSubCategory.categoryId]: state.subCategoriesMap[
            updatedSubCategory.categoryId
          ].map((subcat) => {
            if (subcat.id === oldSubCatId) {
              return updatedSubCategory;
            } else {
              return subcat;
            }
          }),
        },
      };
    }),
  // filters
  filters: DEFAULT_INITIAL_FILTERS,
  setFilters: (filter) =>
    set((state) => ({
      filters: { ...state.filters, ...filter },
    })),
}));
