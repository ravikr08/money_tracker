import { Dialog } from "@base-ui/react";
import type {
  Category,
  DialogPayload,
  InitFiltersValues,
  OriginFilterValues,
  StatusFilterValues,
  SubCategory,
  TypeFilterValues,
} from "./category.model";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "salary",
    name: "Salary",
    icon: "💼",
    color: "#22C55E",
    type: "income",
    origin: "default",
    status: "active",
  },
  {
    id: "freelance",
    name: "Freelance",
    icon: "💻",
    color: "#3B82F6",
    type: "income",
    origin: "default",
    status: "active",
  },
  {
    id: "investment",
    name: "Investments",
    icon: "📈",
    color: "#8B5CF6",
    type: "income",
    origin: "default",
    status: "active",
  },
  {
    id: "gift",
    name: "Gift",
    icon: "🎁",
    color: "#EC4899",
    type: "income",
    origin: "custom",
    status: "active",
  },
  {
    id: "refund",
    name: "Refund",
    icon: "↩️",
    color: "#14B8A6",
    type: "income",
    origin: "custom",
    status: "archived",
  },
  {
    id: "food",
    name: "Food",
    icon: "🍔",
    color: "#F97316",
    type: "expense",
    origin: "default",
    status: "active",
  },
  {
    id: "transport",
    name: "Transport",
    icon: "🚗",
    color: "#0EA5E9",
    type: "expense",
    origin: "default",
    status: "active",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "🛍️",
    color: "#EC4899",
    type: "expense",
    origin: "default",
    status: "active",
  },
  {
    id: "health",
    name: "Healthcare",
    icon: "🏥",
    color: "#EF4444",
    type: "expense",
    origin: "default",
    status: "active",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "🎬",
    color: "#A855F7",
    type: "expense",
    origin: "default",
    status: "active",
  },
  {
    id: "education",
    name: "Education",
    icon: "📚",
    color: "#6366F1",
    type: "expense",
    origin: "custom",
    status: "active",
  },
  {
    id: "Pets",
    name: "Pets",
    icon: "🐶",
    color: "#84CC16",
    type: "expense",
    origin: "custom",
    status: "archived",
  },
  {
    id: "transfer",
    name: "Transfer",
    icon: "🔄",
    color: "#64748B",
    type: "transfer",
    origin: "default",
    status: "active",
  },
  {
    id: "credit-card-payment",
    name: "Credit Card Payment",
    icon: "💳",
    color: "#F59E0B",
    type: "payment",
    origin: "default",
    status: "active",
  },
];
export const DEFAULT_SUBCATEGORIES_MAP: Record<string, SubCategory[]> = {
  food: [
    {
      id: "groceries",
      name: "Groceries",
      origin: "default",
      status: "active",
      categoryId: "food",
    },
    {
      id: "restaurants",
      name: "Restaurants",
      origin: "default",
      status: "active",
      categoryId: "food",
    },
    {
      id: "snacks",
      name: "Snacks",
      origin: "custom",
      status: "active",
      categoryId: "food",
    },
  ],

  transport: [
    {
      id: "fuel",
      name: "Fuel",
      origin: "default",
      status: "active",
      categoryId: "transport",
    },
    {
      id: "cab",
      name: "Cab",
      origin: "custom",
      status: "archived",
      categoryId: "transport",
    },
    {
      id: "bus",
      name: "Bus / Train",
      origin: "default",
      status: "archived",
      categoryId: "transport",
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

export const AVAILABLE_CATEGORY_ICONS = [
  // 💰 Income & Finance
  "💰",
  "💵",
  "💸",
  "💳",
  "🏦",
  "📈",
  "📉",
  "💼",
  "🪙",
  "🎁",

  // 🍔 Food & Drinks
  "🍔",
  "🍕",
  "🌮",
  "🍜",
  "🍱",
  "🍣",
  "🥗",
  "🍎",
  "☕",
  "🍺",

  // 🚗 Travel & Transport
  "🚗",
  "🏍️",
  "🚲",
  "🚌",
  "🚆",
  "🚕",
  "✈️",
  "🚢",
  "⛽",
  "🛣️",

  // 🛍️ Shopping
  "🛒",
  "🛍️",
  "👕",
  "👟",
  "⌚",
  "💍",
  "👜",
  "🎀",

  // 🏠 Home
  "🏠",
  "🏡",
  "🛏️",
  "🛋️",
  "🚿",
  "🪑",
  "🧹",
  "💡",

  // ❤️ Health
  "❤️",
  "🏥",
  "💊",
  "🩺",
  "🦷",
  "👓",
  "🧘",

  // 🎮 Entertainment
  "🎬",
  "🎮",
  "🎵",
  "🎧",
  "📺",
  "🎭",
  "🎨",
  "📚",

  // 👨‍🎓 Education
  "🎓",
  "✏️",
  "📝",
  "📖",
  "💻",

  // 👨‍👩‍👧 Family
  "👨‍👩‍👧",
  "👶",
  "🐶",
  "🐱",
  "🎂",
  "🎉",

  // 🏖️ Lifestyle
  "🏖️",
  "🏕️",
  "🌍",
  "📷",
  "🏋️",
  "⚽",
  "🎾",

  // 🔧 Utilities
  "📱",
  "📶",
  "💧",
  "🔥",
  "⚡",
  "🌐",

  // 🔄 Transfers & Misc
  "🔄",
  "📦",
  "📌",
  "⭐",
  "❓",
];

export const createInitialCategory = () => ({
  name: "",
  type: "expense",
  color: AVAILABLE_CATEGORY_COLORS[0],
  icon: AVAILABLE_CATEGORY_ICONS[0],
});
export const createInitialSubCategory = () => ({
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
export const CATEGORY_ORIGIN_FILTER_OPTIONS: {
  value: OriginFilterValues;
  label: string;
}[] = [
  { value: "all", label: "All origins" },
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
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
  origin: "all",
  status: "all",
};

export const CATEGORY_DIALOG_HANDLE = Dialog.createHandle<DialogPayload>();
