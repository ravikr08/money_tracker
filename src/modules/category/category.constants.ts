import { Dialog } from "@base-ui/react";
import { CATEGORY_ICON_KEYS } from "./category.icons";
import type {
  Category,
  CategoryDialogPayload,
  InitFiltersValues,
  StatusFilterValues,
  SubCategory,
  SubcategoryDialogPayload,
  TypeFilterValues,
} from "./category.model";

// ids are fixed uuids (not generated on load) so saved transactions can keep pointing to them,
// don't change them and don't base them on the name
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "4b6c59e9-0967-49c0-a51a-c922de25b9ee",
    name: "Salary",
    icon: "briefcase",
    color: "#22C55E",
    type: "income",
    status: "active",
  },
  {
    id: "f3835e0a-8f18-4032-80e6-5e743f662516",
    name: "Freelance",
    icon: "laptop",
    color: "#3B82F6",
    type: "income",
    status: "active",
  },
  {
    id: "582f86f9-eda9-4b30-9b06-5b39a88ed09f",
    name: "Investments",
    icon: "trending-up",
    color: "#8B5CF6",
    type: "income",
    status: "active",
  },
  {
    id: "40fc1d48-89e9-49b6-ba5f-2cce752f0528",
    name: "Gift",
    icon: "gift",
    color: "#EC4899",
    type: "income",
    status: "active",
  },
  {
    id: "a23ba769-34d7-44e9-a813-d3b1996c6f29",
    name: "Refund",
    icon: "rotate-ccw",
    color: "#14B8A6",
    type: "income",
    status: "archived",
  },
  {
    id: "c1670173-8159-4407-a78e-a504128c1209",
    name: "Food",
    icon: "utensils",
    color: "#F97316",
    type: "expense",
    status: "active",
  },
  {
    id: "89399fec-c535-4046-912e-ca589b6c8698",
    name: "Transport",
    icon: "car-front",
    color: "#0EA5E9",
    type: "expense",
    status: "active",
  },
  {
    id: "8421dd73-9ffc-47a3-8d4b-926635851084",
    name: "Shopping",
    icon: "shopping-bag",
    color: "#EC4899",
    type: "expense",
    status: "active",
  },
  {
    id: "2587d6d0-2ce2-4065-9046-9b09499e3581",
    name: "Healthcare",
    icon: "heart",
    color: "#EF4444",
    type: "expense",
    status: "active",
  },
  {
    id: "9fc4b2ab-7347-4dd3-af40-7426dea024bb",
    name: "Entertainment",
    icon: "clapperboard",
    color: "#A855F7",
    type: "expense",
    status: "active",
  },
  {
    id: "8d62e48a-5835-4d23-b90a-6cc6b1c8eca5",
    name: "Education",
    icon: "book",
    color: "#6366F1",
    type: "expense",
    status: "active",
  },
  {
    id: "a86c5bbc-b2d4-4a68-a661-5acab4a6f586",
    name: "Pets",
    icon: "dog",
    color: "#84CC16",
    type: "expense",
    status: "archived",
  },
  {
    id: "d45e81ac-8a29-4e23-a35c-6f625fd2ab91",
    name: "Transfer",
    icon: "refresh-cw",
    color: "#64748B",
    type: "transfer",
    status: "active",
  },
  {
    id: "ef12eb13-bf18-423d-af72-3eebfb5b4846",
    name: "Credit Card Payment",
    icon: "credit-card",
    color: "#F59E0B",
    type: "payment",
    status: "active",
  },
];
// key = id of the category it belongs to
export const DEFAULT_SUBCATEGORIES_MAP: Record<string, SubCategory[]> = {
  "c1670173-8159-4407-a78e-a504128c1209": [
    {
      id: "65b8050c-6569-4361-983d-244d245594dc",
      name: "Groceries",
      status: "active",
      categoryId: "c1670173-8159-4407-a78e-a504128c1209",
    },
    {
      id: "8b78e9ff-9164-4516-895f-81b47eccba18",
      name: "Restaurants",
      status: "active",
      categoryId: "c1670173-8159-4407-a78e-a504128c1209",
    },
    {
      id: "0ba2c292-ef93-414e-908a-48f36af59dc3",
      name: "Snacks",
      status: "active",
      categoryId: "c1670173-8159-4407-a78e-a504128c1209",
    },
  ],

  "89399fec-c535-4046-912e-ca589b6c8698": [
    {
      id: "afcf52cb-76be-45ed-9c13-28c4e6e5078f",
      name: "Fuel",
      status: "active",
      categoryId: "89399fec-c535-4046-912e-ca589b6c8698",
    },
    {
      id: "d3d79516-20d4-4b29-be03-8b3abbd81f15",
      name: "Cab",
      status: "archived",
      categoryId: "89399fec-c535-4046-912e-ca589b6c8698",
    },
    {
      id: "a9fdfa41-efa4-42f9-b5fb-64a1e8a776ee",
      name: "Bus / Train",
      status: "archived",
      categoryId: "89399fec-c535-4046-912e-ca589b6c8698",
    },
  ],
};
export const AVAILABLE_CATEGORY_COLORS = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#FACC15", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#A16207", // Amber Brown
  "#65A30D", // Olive
  "#7C3AED", // Deep Purple
  "#57534E", // Dark Stone
];

// the keys of the icons in category.icons.ts
export const AVAILABLE_CATEGORY_ICONS = CATEGORY_ICON_KEYS;

export const createInitialCategory = (): Pick<Category, "name"|"icon"|"color"|"type"> => ({
  name: "",
  type: "expense",
  color: AVAILABLE_CATEGORY_COLORS[0],
  icon: AVAILABLE_CATEGORY_ICONS[0],
});

export const createInitialSubCategory = (): Pick<SubCategory, "name"> => ({
  name: "",
});

export const CATEGORY_TYPE_FILTER_OPTIONS: {
  value: TypeFilterValues;
  label: string;
}[] = [
  { value: "all", label: "All types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];
export const CATEGORY_STATUS_FILTER_OPTIONS: {
  value: StatusFilterValues;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export const DEFAULT_INITIAL_FILTERS: InitFiltersValues = {
  type: "all",
  status: "active",
};

export const CATEGORY_DIALOG_HANDLE = Dialog.createHandle<CategoryDialogPayload>();
export const SUBCATEGORY_DIALOG_HANDLE = Dialog.createHandle<SubcategoryDialogPayload>();