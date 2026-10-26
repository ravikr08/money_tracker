import type { DashboardPeriod } from "./dashboard.utils";

export const DASHBOARD_PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: "thisMonth", label: "This month" },
  { value: "lastMonth", label: "Last month" },
  { value: "thisYear", label: "This year" },
];

// the list of the recent transactions: a period, or the income / expense of the last 30 days
export type RecentFilter = "today" | "last7" | "last30" | "income" | "expense";
export const RECENT_FILTER_OPTIONS: { value: RecentFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];
export const RECENT_LIMIT = 6;
