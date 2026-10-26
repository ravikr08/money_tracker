import { appStore } from "@/app/app.store";
import * as categoryActions from "./category.slice";
import type {
  Category,
  CategoryInputValues,
  InitFiltersValues,
  SubCategory,
  SubcategoryInputValues,
} from "./category.model";
import { isUniqueName } from "@/shared/utils/utils";

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
    return isUniqueName(name, this.getAllCategories(), id);
  },

  isUniqueSubcategoryInCategory(name: string, catId: string, id: string) {
    return isUniqueName(name, this.getSubCategoriesByCategory(catId), id);
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
    };

    categoryStore.dispatch(
      categoryActions.categoryAdded({ newCat: categoryObj }),
    );

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

    categoryStore.dispatch(
      categoryActions.categoryUpdated({ updatedCat: categoryObject, id: id }),
    );
    return {
      success: true,
      message: "Category updated successfully.",
    };
  },

  archiveCategories(catId: string[]) {
    categoryStore.dispatch(categoryActions.categoriesArchived({ ids: catId }));
  },

  restoreCategories(catId: string[]) {
    categoryStore.dispatch(categoryActions.categoriesRestored({ ids: catId }));
  },

  deleteCategories(catId: string[]) {
    categoryStore.dispatch(categoryActions.categoriesRemoved({ ids: catId }));
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
    };

    categoryStore.dispatch(
      categoryActions.subCategoryAdded({ newSubCat: subcatObj }),
    );

    return {
      success: true,
      message: "Subcategory created successfully.",
    };
  },

  updateSubcategory(
    subcatObject: SubcategoryInputValues,
    id: string,
    catId: string,
  ) {
    if (!this.isUniqueSubcategoryInCategory(subcatObject.name, catId, id)) {
      return {
        success: false,
        error: "Subcategory name already exist in this category",
      };
    }

    categoryStore.dispatch(
      categoryActions.subCategoryUpdated({
        updatedSubCat: subcatObject,
        id: id,
        categoryId: catId,
      }),
    );
    return {
      success: true,
      message: "Subcategory updated successfully.",
    };
  },

  archiveSubcategory(id: string, catId: string) {
    categoryStore.dispatch(categoryActions.subcategoryArchived({ id, catId }));
  },

  restoreSubcategory(id: string, catId: string) {
    categoryStore.dispatch(categoryActions.subcategoryRestored({ id, catId }));
  },

  deleteSubcategory(id: string, catId: string) {
    categoryStore.dispatch(categoryActions.subcategoryRemoved({ id, catId }));
  },

  // filters
  getFilters() {
    return categoryStore.get().filters;
  },

  updateFilters(obj: Partial<InitFiltersValues>) {
    categoryStore.dispatch(categoryActions.filtersUpdated({ updates: obj }));
  },
};
