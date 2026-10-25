// placeholder data so the transactions page has something to show.
// UI only: everything is already a display string, the real data and formatting come later

export type PlaceholderKind = "income" | "expense" | "transfer" | "card";

export type PlaceholderRow = {
  id: string;
  kind: PlaceholderKind;
  title: string;
  time: string;
  note?: string;
  category: string;
  account: string;
  date: string;
  amount: string;
};

export type PlaceholderGroup = {
  label: string;
  count: string;
  net: string;
  // green for money in, grey otherwise
  positive: boolean;
  rows: PlaceholderRow[];
};

export const PLACEHOLDER_SUMMARY = {
  income: { value: "+₹85,340", caption: "1 Oct – 24 Oct 2026" },
  expense: { value: "−₹10,240", caption: "Transfers excluded" },
  net: { value: "+₹75,100", caption: "Income − expense" },
  count: { value: "14", caption: "In this period" },
};

export const PLACEHOLDER_RANGE = "1 Oct – 24 Oct 2026";

export const PLACEHOLDER_GROUPS: PlaceholderGroup[] = [
  {
    label: "Today · 24 Oct",
    count: "2 transactions",
    net: "+₹71,514",
    positive: true,
    rows: [
      { id: "p1", kind: "income", title: "Salary · Acme Corp", time: "9:05 am", note: "October salary", category: "Work › Salary", account: "jhgyu", date: "24 Oct", amount: "+₹72,000" },
      { id: "p2", kind: "expense", title: "Swiggy", time: "1:12 pm", note: "Team lunch", category: "Food › Restaurant", account: "bncbc", date: "24 Oct", amount: "−₹486" },
    ],
  },
  {
    label: "Yesterday · 23 Oct",
    count: "2 transactions",
    net: "−₹312",
    positive: false,
    rows: [
      { id: "p3", kind: "transfer", title: "Wallet top-up", time: "11:20 am", category: "Transfer", account: "jhgyu → dgdd", date: "23 Oct", amount: "₹5,000" },
      { id: "p4", kind: "expense", title: "Uber", time: "8:40 pm", category: "Transport › Cab", account: "dgdd", date: "23 Oct", amount: "−₹312" },
    ],
  },
  {
    label: "Wed · 21 Oct",
    count: "2 transactions",
    net: "−₹4,169",
    positive: false,
    rows: [
      { id: "p5", kind: "expense", title: "Electricity bill", time: "10:15 am", category: "Bills › Electricity", account: "jhgyu", date: "21 Oct", amount: "−₹1,820" },
      { id: "p6", kind: "expense", title: "Amazon", time: "6:02 pm", note: "Headphones", category: "Shopping › Online", account: "sffsd", date: "21 Oct", amount: "−₹2,349" },
    ],
  },
  {
    label: "Mon · 19 Oct",
    count: "2 transactions",
    net: "+₹11,851",
    positive: true,
    rows: [
      { id: "p7", kind: "income", title: "Freelance payout", time: "4:30 pm", note: "Logo project", category: "Work › Freelance", account: "dgdd", date: "19 Oct", amount: "+₹12,500" },
      { id: "p8", kind: "expense", title: "Netflix", time: "7:00 am", category: "Entertainment › Subscriptions", account: "bncbc", date: "19 Oct", amount: "−₹649" },
    ],
  },
  {
    label: "Thu · 15 Oct",
    count: "2 transactions",
    net: "−₹1,264",
    positive: false,
    rows: [
      { id: "p9", kind: "expense", title: "BigBasket", time: "6:45 pm", note: "Weekly groceries", category: "Food › Grocery", account: "dgdd", date: "15 Oct", amount: "−₹1,264" },
      { id: "p10", kind: "card", title: "Card bill payment", time: "12:00 pm", category: "Credit card payment", account: "jhgyu → sffsd", date: "15 Oct", amount: "₹3,000" },
    ],
  },
];

export const PLACEHOLDER_SHOWING = "Showing 1–10 of 14";
export const PLACEHOLDER_REMAINING = "4 more";

// the options of the filter dropdowns, from the design. `selected` is only which one looks ticked
export type FilterOption = { label: string, sub?: string };

export const VIEW_OPTIONS: FilterOption[] = [
  { label: "Daily" },
  { label: "Weekly" },
  { label: "Monthly" },
  { label: "Calendar" },
];

export const PERIOD_OPTIONS: FilterOption[] = [
  { label: "Today" },
  { label: "Last 7 days" },
  { label: "Last 30 days" },
  { label: "This month" },
  { label: "Last month" },
  { label: "This year" },
  { label: "Custom range" },
];

export const TYPE_OPTIONS: FilterOption[] = [
  { label: "All types" },
  { label: "Income" },
  { label: "Expense" },
  { label: "Transfer" },
  { label: "Card payment" },
];

export const ACCOUNT_OPTIONS: FilterOption[] = [
  { label: "All accounts" },
  { label: "dgdd", sub: "Digital Wallet" },
  { label: "jhgyu", sub: "Bank Account" },
  { label: "bncbc", sub: "Credit card · ₹5,575 due" },
  { label: "sffsd", sub: "Credit card · ₹343 due" },
];

export const CATEGORY_OPTIONS: FilterOption[] = [
  { label: "All categories" },
  { label: "Food" },
  { label: "Transport" },
  { label: "Shopping" },
  { label: "Bills" },
  { label: "Entertainment" },
  { label: "Health" },
  { label: "Work" },
  { label: "Investments" },
  { label: "Gifts" },
];
