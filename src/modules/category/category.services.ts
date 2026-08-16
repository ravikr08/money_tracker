import { appStore } from "@/app/appStore";
import {
  categoryAdded,
  categoryUpdated,
  subCategoryAdded,
  subCategoryUpdated,
  filtersUpdated,
  categoriesArchived,
  categoriesRestored,
  subcategoriesArchived,
  subcategoriesRestored,
} from "./category.slice";
import type {
  Category,
  CategoryInputValues,
  InitFiltersValues,
  SubCategory,
  SubcategoryInputValues,
} from "./category.model";




const categoryStore = {
  get() {
    return appStore.getState().categorySlice;
  },
  dispatch: appStore.dispatch,
};

export const categoryServices = {
  // get
  getAllCategories() {
    const { categories } = categoryStore.get();
    return categories;
  },

  getSubCategoriesMap() {
    const { subcategoriesMap } = categoryStore.get();
    return subcategoriesMap;
  },

  getCategoryById(id: string): Category {
    // return this.getAllCategories().find((cat) => cat.id === id)!;
    const category = this.getAllCategories().find((cat) => cat.id === id);

    if (!category) {
      throw new Error(`Category not found: ${id}`);
    }

    return category;
  },

  getSubCategoriesByCategory(catId: string): SubCategory[] {
    return this.getSubCategoriesMap()[catId] ?? [];
  },

  getSubCategoryById(id: string, catId: string) {
    const subcategory = this.getSubCategoriesByCategory(catId).find(
      (subcat) => subcat.id === id,
    );

    if (!subcategory) {
      throw new Error(`Subcategory not found: ${id}`);
    }

    return subcategory;
  },

  // validation
  isUniqueCategoryName(name: string, id: string) {
    let res = !this.getAllCategories().some(
      (cat) => {
        return cat.name.trim().toLowerCase() === name.trim().toLowerCase() && cat.id !== id
      }
    );
    return res;

  },

  isUniqueSubcategoryInCategory(name: string, catId: string, id: string) {
    const subcategoriesArr = this.getSubCategoriesByCategory(catId);
    if (!subcategoriesArr || !subcategoriesArr.length) {
      return true;
    }
    return !subcategoriesArr.some(
      (subcat) => {
        return subcat.name.trim().toLowerCase() === name.trim().toLowerCase() && subcat.id !== id
      },
    );
  },

  // category

  createCategory(categoryObject: CategoryInputValues) {
    const id = crypto.randomUUID();
    if (!this.isUniqueCategoryName(categoryObject.name, id)) {
      return {
        success: false,
        error: "Category name already exist.",
      };
    }
    const categoryObj: Category = {
      ...categoryObject,
      id: id,
      status: "active",
      origin: "custom",
    };

    categoryStore.dispatch(categoryAdded({ newCat: categoryObj }));

    return {
      success: true,
      message: "Category created successfully.",
    };
  },

  updateCategory(categoryObject: CategoryInputValues, id: string) {
    if (!this.isUniqueCategoryName(categoryObject.name, id)) {
      return {
        success: false,
        error: "Category name already exist.",
      };
    }

    categoryStore.dispatch(categoryUpdated({ updatedCat: categoryObject, id: id }));
    return {
      success: true,
      message: "Category updated successfully.",
    };
  },

  archiveCategories(catId: string[]) {
    categoryStore.dispatch(categoriesArchived({ ids: catId }));
  },

  restoreCategories(catId:string[]){
    categoryStore.dispatch(categoriesRestored({ids: catId}));
  },

  // will be implemented 
  // deleteCategories(id)
  //       ↓
  // transactionService.isCategoryUsed(id)
  //       ↓
  // true  → don't delete; tell UI to archive
  // false → permanently delete
  // deleteCategories(catId:string[]){

  //     categoryStore.dispatch(categoriesDeleted)
  // },

  // subcategory
  createSubcategory(subcatObject: SubcategoryInputValues, categoryId: string) {
    const id = crypto.randomUUID();
    if (
      !this.isUniqueSubcategoryInCategory(subcatObject.name, categoryId, id)
    ) {
      return {
        success: false,
        error: "Subcategory name already exist in this category",
      };
    }
    const subcatObj: SubCategory = {
      ...subcatObject,
      id: id,
      categoryId: categoryId,
      status: "active",
      origin: "custom",
    };

    categoryStore.dispatch(subCategoryAdded({ newSubCat: subcatObj }));

    return {
      success: true,
      message: "Subcategory created successfully.",
    };
  },

  updateSubcategory(subcatObject: SubcategoryInputValues, id: string, catId: string) {

    if (
      !this.isUniqueSubcategoryInCategory(
        subcatObject.name,
        catId,
        id,
      )
    ) {
      return {
        success: false,
        error: "Subcategory name already exist in this category",
      };
    }

    categoryStore.dispatch(subCategoryUpdated({ updatedSubCat: subcatObject, id: id, categoryId: catId }));
    return {
      success: true,
      message: "Subcategory updated successfully.",
    };
  },

  archiveSubcategories(id:string,catId:string) {
    categoryStore.dispatch(subcategoriesArchived({ id, catId }));
  },

  restoreSubcategories(id:string,catId:string){
    categoryStore.dispatch(subcategoriesRestored({id,catId}));
  },

  // filters
  getFilters() {
    return categoryStore.get().filters;
  },

  updateFilters(obj: Partial<InitFiltersValues>) {
    categoryStore.dispatch(filtersUpdated({ updates: obj }));
  },
};
