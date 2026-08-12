import type { TransactionTypes } from "../transactions/transaction.model";
export type Category = {
  id: string;
  name: string;
  icon: string;
  type: TransactionTypes;
  origin: "default" | "custom";
  status: "active" | "archived";
  color: string;
};

export type SubCategory = {
  id: string;
  name: string;
  origin: "default" | "custom";
  status: "active" | "archived";
  categoryId: string;
};

export type TypeFilterValues = "all" | "income" | "expense";

export type OriginFilterValues = "all" | "default" | "custom";

export type StatusFilterValues = "all" | "active" | "archived";

export type CategoryTypes = "income" | "expense";

export type SubCategoryMap = Record<string, SubCategory[]>;

export type InitFiltersValues = {
  type: TypeFilterValues;
  origin: OriginFilterValues;
  status: StatusFilterValues;
};

export type CategoryPayload = {
  type: "category";
  mode: "edit" | "create";
  data: Category;
};

export type SubCategoryPayload = {
  type: "subcategory";
  mode: "edit" | "create";
  data: SubCategory;
};

export type DialogPayload = CategoryPayload | SubCategoryPayload;

export type CategoryStore = {
  categories: Category[];
  subCategoriesMap: SubCategoryMap;
  addNewCategory: (newCat: Category) => void;
  updateCategory: (updatedCat: Category, oldId: string) => void;
  addNewSubCategory: (newSubCat: SubCategory, catId: string) => void;
  updateSubCategory: (
    updatedSubCategory: SubCategory,
    oldSubCatId: string,
  ) => void;
  filters: InitFiltersValues;
  setFilters: (filter: Partial<InitFiltersValues>) => void;
};
