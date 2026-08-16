import { createSlice } from "@reduxjs/toolkit";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_INITIAL_FILTERS,
  DEFAULT_SUBCATEGORIES_MAP,
} from "./category.constants";
import type {
  Category,
  SubCategoryMap,
} from "./category.model";

function createInitialState() {
  const categories:Category[] = DEFAULT_CATEGORIES.map((cat) => ({
    ...cat,
    id: crypto.randomUUID(),
  }));
  const subcategoriesMap: SubCategoryMap = {};
  Object.keys(DEFAULT_SUBCATEGORIES_MAP).forEach((key) => {
    const catObj = categories.find((cat) => cat.name.toLowerCase() === key);
    if (catObj?.id) {
      subcategoriesMap[catObj.id] = DEFAULT_SUBCATEGORIES_MAP[key].map(subcat => ({ ...subcat, categoryId: catObj.id }));
    }
  });
  return {
    categories,
    subcategoriesMap,
    filters: DEFAULT_INITIAL_FILTERS,
  };
}

const initialState = createInitialState();

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
      const { updatedCat, id} = action.payload;
      state.categories = state.categories.map((el) =>
        el.id !== id ? el : {...el,...updatedCat},
      );
    },
    categoriesArchived(state,action){
      const ids = new Set(action.payload.ids);
      state.categories.forEach(category=>{
        if (ids.has(category.id)) {
          category.status = "archived"
        }
      })
    },
    categoriesRestored(state,action){
      const ids = new Set(action.payload.ids);
      state.categories.forEach(category=>{
        if (ids.has(category.id)) {
          category.status = "active"
        }
      })
    },
    // subcategory
    subCategoryAdded(state, action) {
      const { newSubCat } = action.payload;
      if(state.subcategoriesMap[newSubCat.categoryId]){
        state.subcategoriesMap[newSubCat.categoryId].unshift(newSubCat);
      }else{
        state.subcategoriesMap[newSubCat.categoryId] = [newSubCat];
      }
    },
    subCategoryUpdated(state, action) {
      const { updatedSubCat, id, categoryId } = action.payload;
      state.subcategoriesMap[categoryId] = state.subcategoriesMap[categoryId].map((el) => (el.id !== id ? el : {...el,...updatedSubCat}));
    },

     subcategoriesArchived(state,action){
      const id = action.payload.id;
      const catid = action.payload.catId;
      state.subcategoriesMap[catid].forEach(subcat=>{
        if (id === subcat.id) {
          subcat.status = "archived"
        }
      })
    },
    subcategoriesRestored(state,action){
      const id = action.payload.id;
      const catid = action.payload.catId;
      state.subcategoriesMap[catid].forEach(subcat=>{
        if (id === subcat.id) {
          subcat.status = "active"
        }
      })
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
  subCategoryAdded,
  subCategoryUpdated,
  subcategoriesArchived,
  subcategoriesRestored,
  filtersUpdated,
} = categorySlice.actions;

export default categorySlice.reducer;
