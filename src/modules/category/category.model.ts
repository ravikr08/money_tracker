export type CategoryTypes = "income" | "expense";

  export type Category =  {
  name: string;
  icon: string;
  type: CategoryTypes;
  color: string;
  id: string;
  origin: "default" | "custom";
  status: "active" | "archived";
};

export type SubCategory = {
  name: string;
  id: string;
  origin: "default" | "custom";
  status: "active" | "archived";
  categoryId: string;
};
export type CategoryInputValues = Pick<Category, "name"|"icon"|"color"|"type">
export type SubcategoryInputValues = Pick<Category, "name">
export type TypeFilterValues = "all" | "income" | "expense";

export type OriginFilterValues = "all" | "default" | "custom";

export type StatusFilterValues = "all" | "active" | "archived";

export type SubCategoryMap = Record<string, SubCategory[]>;

export type InitFiltersValues = {
  type: TypeFilterValues;
  origin: OriginFilterValues;
  status: StatusFilterValues;
};

export type EditCategoryPayload = {
  mode: "edit";
  id: string;
};
export type CreateCategoryPayload = {
  mode: "create";
};

export type EditSubCategoryPayload = {
  mode: "edit";
  id: string;
  categoryId: string;
};
export type CreateSubCategoryPayload = {
  mode: "create";
  categoryId: string;
};

export type CategoryDialogPayload =
  | EditCategoryPayload
  | CreateCategoryPayload

export type SubcategoryDialogPayload =
  | EditSubCategoryPayload
  | CreateSubCategoryPayload
