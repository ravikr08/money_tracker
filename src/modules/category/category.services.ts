import { appStore } from "@/app/appStore";
import {
  categoryAdded,
  categoryUpdated,
  subCategoryAdded,
  subCategoryUpdated,
  filtersUpdated,
} from "./category.slice";
import type { Category, SubCategory } from "./category.model";

const categoryStore = {
  get() {
    return appStore.getState().categories;
  },
  dispatch: appStore.dispatch,
};

function getAllCategories() {
  const { categories } = categoryStore.get();
  return categories;
}

function getSubCategoriesMap() {
  const { subcategoriesMap } = categoryStore.get();
  return subcategoriesMap;
}

export function getCategoryById(id: string) {
  return getAllCategories().find((cat) => cat.id === id);
}

export function getSubCategoriesByCategory(catId: string) {
  return getSubCategoriesMap()[catId];
}

export function getSubCategoryById(id: string, catId: string) {
  return getSubCategoriesByCategory(catId).find((subcat) => subcat.id === id);
}

export function normalizeCategoryNameToId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\p{L}\p{N}]+/gu, "_") // any letter or number
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

export function isUniqueCategoryId(id: string) {
  return !getAllCategories().some((cat) => cat.id === id);
}

function isUniqueSubcatIdInCategory(id: string, catId: string) {
  return getSubCategoriesByCategory(catId).some(subcat => subcat.id === id);
}

export function createCategory(categoryObject: Category) {
  const catId = normalizeCategoryNameToId(categoryObject.name);
  if (!isUniqueCategoryId(catId)) {
    return {
      success: false,
      error: "Category already exist.",
    };
  }
  const categoryObj: Category = {
    ...categoryObject,
    id: catId,
    status: "active",
    origin: "custom",
  };

  categoryStore.dispatch(categoryAdded(categoryObj));

  return {
    success: true,
    message: "Category created successfully.",
  };
}
export function updateCategory(categoryObject: Category) {
  const catId = normalizeCategoryNameToId(categoryObject.name);
  if (!isUniqueCategoryId(catId)) {
    return {
      success: false,
      error: "Category already exist.",
    };
  }
  const categoryObj: Category = {
    ...categoryObject,
    id: catId,
  };
  categoryStore.dispatch(categoryUpdated(categoryObj));
  return {
    success: true,
    message: "Category updated successfully.",
  };
}
function updateCategoryIdInSubcats(oldCatId: string, newCatId: string) {
  const subcats = getSubCategoriesByCategory(oldCatId);
  const
}
export function createSubcategory(subcatObject: SubCategory, categoryId: string) {
  const id = normalizeCategoryNameToId(subcatObject.name);
  if (!isUniqueSubcatIdInCategory(id, categoryId)) {
    return {
      success: false,
      error: "Subcategory already exist in this category",
    };
  }
  const subcatObj: SubCategory = {
    ...subcatObject,
    id: id,
    categoryId: categoryId,
    status: "active",
    origin: "custom",
  };

  categoryStore.dispatch(subCategoryAdded(subcatObj));

  return {
    success: true,
    message: "Subcategory created successfully.",
  };
}
export function updateSubcategory(subcatObject: SubCategory, catId?: string) {

  const subcatObj: SubCategory = {
    ...subcatObject,
  };

  if (catId) {
    subcatObj.categoryId = catId;
  } else {
    const id = normalizeCategoryNameToId(subcatObject.name);
    if (!isUniqueCategoryId(id)) {
      return {
        success: false,
        error: "Subcategory already exist in this category",
      };
    }
    subcatObj.id = id;
  }

  categoryStore.dispatch(subCategoryUpdated(subcatObj));
  return {
    success: true,
    message: "Subcategory updated successfully.",
  };
}