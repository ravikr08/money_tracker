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
      { id: "p1", kind: "income", title: "Salary · Acme Corp", time: "9:05 am", note: "October salary", category: "Work › Salary", account: "HDFC Savings", date: "24 Oct", amount: "+₹72,000" },
      { id: "p2", kind: "expense", title: "Swiggy", time: "1:12 pm", note: "Team lunch", category: "Food › Restaurant", account: "HDFC Millennia", date: "24 Oct", amount: "−₹486" },
    ],
  },
  {
    label: "Yesterday · 23 Oct",
    count: "2 transactions",
    net: "−₹312",
    positive: false,
    rows: [
      { id: "p3", kind: "transfer", title: "Wallet top-up", time: "11:20 am", category: "Transfer", account: "HDFC Savings → PhonePe", date: "23 Oct", amount: "₹5,000" },
      { id: "p4", kind: "expense", title: "Uber", time: "8:40 pm", category: "Transport › Cab", account: "PhonePe", date: "23 Oct", amount: "−₹312" },
    ],
  },
  {
    label: "Wed · 21 Oct",
    count: "2 transactions",
    net: "−₹4,169",
    positive: false,
    rows: [
      { id: "p5", kind: "expense", title: "Electricity bill", time: "10:15 am", category: "Bills › Electricity", account: "HDFC Savings", date: "21 Oct", amount: "−₹1,820" },
      { id: "p6", kind: "expense", title: "Amazon", time: "6:02 pm", note: "Headphones", category: "Shopping › Online", account: "Amazon Pay Card", date: "21 Oct", amount: "−₹2,349" },
    ],
  },
  {
    label: "Mon · 19 Oct",
    count: "2 transactions",
    net: "+₹11,851",
    positive: true,
    rows: [
      { id: "p7", kind: "income", title: "Freelance payout", time: "4:30 pm", note: "Logo project", category: "Work › Freelance", account: "PhonePe", date: "19 Oct", amount: "+₹12,500" },
      { id: "p8", kind: "expense", title: "Netflix", time: "7:00 am", category: "Entertainment › Subscriptions", account: "HDFC Millennia", date: "19 Oct", amount: "−₹649" },
    ],
  },
  {
    label: "Thu · 15 Oct",
    count: "2 transactions",
    net: "−₹1,264",
    positive: false,
    rows: [
      { id: "p9", kind: "expense", title: "BigBasket", time: "6:45 pm", note: "Weekly groceries", category: "Food › Grocery", account: "PhonePe", date: "15 Oct", amount: "−₹1,264" },
      { id: "p10", kind: "card", title: "Card bill payment", time: "12:00 pm", category: "Credit card payment", account: "HDFC Savings → Amazon Pay Card", date: "15 Oct", amount: "₹3,000" },
    ],
  },
];

export const PLACEHOLDER_SHOWING = "Showing 1–10 of 14";
export const PLACEHOLDER_REMAINING = "4 more";

// one option of a filter dropdown. `value` is what gets stored, `label` is what is shown
export type FilterOption = { label: string, value?: string, sub?: string };
