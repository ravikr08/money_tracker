import { formatCurrency } from "@/shared/utils/utils";
import type {
  PeriodKey,
  Transaction,
  TransactionFilter,
  TransactionFiltersState,
  ViewKey,
} from "./transaction.model";

const startOfDay = (y: number, m: number, d: number) => new Date(y, m, d);
const endOfDay = (y: number, m: number, d: number) =>
  new Date(y, m, d, 23, 59, 59, 999);

// the dates are worked out from "now" each time, so "This month" never goes stale
export function getPeriodRange(period: PeriodKey, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  switch (period) {
    case "today":
      return { from: startOfDay(y, m, d), to: endOfDay(y, m, d) };
    case "last7":
      return { from: startOfDay(y, m, d - 6), to: endOfDay(y, m, d) };
    case "last30":
      return { from: startOfDay(y, m, d - 29), to: endOfDay(y, m, d) };
    case "thisMonth":
      return { from: startOfDay(y, m, 1), to: endOfDay(y, m + 1, 0) };
    case "lastMonth":
      return { from: startOfDay(y, m - 1, 1), to: endOfDay(y, m, 0) };
    case "thisYear":
      return { from: startOfDay(y, 0, 1), to: endOfDay(y, 11, 31) };
  }
}

// turns what the toolbar shows into the query the service understands
export function buildTransactionQuery(
  filters: TransactionFiltersState,
  now = new Date(),
): TransactionFilter {
  const { from, to } = getPeriodRange(filters.period, now);
  const query: TransactionFilter = { from, to };

  if (filters.type !== "all") query.type = filters.type;
  if (filters.accountId !== "all") query.accountId = filters.accountId;
  if (filters.categoryId !== "all") query.categoryId = filters.categoryId;
  if (filters.search.trim()) query.search = filters.search.trim();
  if (filters.amountMin !== null) query.amountMin = filters.amountMin;
  if (filters.amountMax !== null) query.amountMax = filters.amountMax;
  return query;
}

// "2026-10-24" is read as UTC by new Date(), which can land on the previous day in some timezones,
// so date-only strings are built as local dates instead
export function parseLocalDate(value: string | Date) {
  if (value instanceof Date) return value;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
}

const pad = (n: number) => String(n).padStart(2, "0");
const dateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayMonth = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const round2 = (n: number) => Math.round(n * 100) / 100;

// "1 Oct – 31 Oct 2026"
export function formatPeriodRange(period: PeriodKey, now = new Date()) {
  const { from, to } = getPeriodRange(period, now);
  return `${dayMonth(from)} – ${dayMonth(to)} ${to.getFullYear()}`;
}

export function formatSigned(n: number) {
  if (n === 0) return formatCurrency(0);
  return (n > 0 ? "+" : "−") + formatCurrency(Math.abs(n));
}

// income and expense only, transfers and card payments just move money around. archived ones are not counted
export function summarizeTransactions(list: Transaction[]) {
  let income = 0;
  let expense = 0;
  const counted = list.filter((t) => !t.isArchived);
  for (const t of counted) {
    if (t.type === "income") income += t.amount;
    else if (t.type === "expense") expense += t.amount;
  }
  return {
    income: round2(income),
    expense: round2(expense),
    net: round2(income - expense),
    count: counted.length,
  };
}

// what the transactions did to a credit card: spending with it adds to what is owed, bill payments to it take away (BR-CC-002, BR-CC-003).
// archived and deleted ones count for nothing. `net` is spent − paid
export function creditCardMovement(list: Transaction[], cardId: string) {
  let spent = 0;
  let paid = 0;
  for (const t of list) {
    if (t.isDeleted || t.isArchived) continue;
    if (t.type === "expense" && t.fromAccountId === cardId) spent += t.amount;
    else if (t.type === "payment" && t.toAccountId === cardId) paid += t.amount;
  }
  return { spent: round2(spent), paid: round2(paid), net: round2(spent - paid) };
}

export type CategorySpend = { categoryId: string; amount: number };

// what was spent per category, the biggest first. archived ones are not counted
export function expenseByCategory(list: Transaction[]): CategorySpend[] {
  const totals = new Map<string, number>();
  for (const t of list) {
    if (t.isDeleted || t.isArchived || t.type !== "expense") continue;
    totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([categoryId, amount]) => ({ categoryId, amount: round2(amount) }))
    .sort((a, b) => b.amount - a.amount);
}

export type TransactionGroupData = {
  key: string;
  label: string;
  count: number;
  net: number;
  rows: Transaction[];
};

// newest first: by date, and by the time it was created for the same day. gives a new array
export function sortNewestFirst(list: Transaction[]) {
  return [...list].sort(
    (a, b) =>
      parseLocalDate(b.transactionDate).getTime() -
        parseLocalDate(a.transactionDate).getTime() ||
      b.createdAt.localeCompare(a.createdAt),
  );
}

// newest first, then grouped by day / week (starting Monday) / month depending on the view
// the calendar view has no grouping yet, so it shows days
export function groupTransactions(
  list: Transaction[],
  view: ViewKey,
  now = new Date(),
): TransactionGroupData[] {
  const sorted = sortNewestFirst(list);

  const today = dateKey(now);
  const yesterday = dateKey(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
  );

  const groupOf = (date: Date): { key: string; label: string } => {
    if (view === "monthly") {
      return {
        key: `${date.getFullYear()}-${pad(date.getMonth() + 1)}`,
        label: date.toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      };
    }
    if (view === "weekly") {
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - ((date.getDay() + 6) % 7),
      );
      const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
      return { key: dateKey(start), label: `${dayMonth(start)} – ${dayMonth(end)}` };
    }
    const key = dateKey(date);
    const prefix =
      key === today
        ? "Today"
        : key === yesterday
          ? "Yesterday"
          : date.toLocaleDateString("en-GB", { weekday: "short" });
    return { key, label: `${prefix} · ${dayMonth(date)}` };
  };

  const groups = new Map<string, TransactionGroupData>();
  for (const t of sorted) {
    const { key, label } = groupOf(parseLocalDate(t.transactionDate));
    let group = groups.get(key);
    if (!group) {
      group = { key, label, count: 0, net: 0, rows: [] };
      groups.set(key, group);
    }
    group.rows.push(t);
  }
  for (const group of groups.values()) {
    group.count = group.rows.length;
    group.net = summarizeTransactions(group.rows).net;
  }
  return [...groups.values()];
}
