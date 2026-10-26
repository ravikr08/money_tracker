import type { Transaction } from "@/modules/transactions/transaction.model";
import { parseLocalDate, summarizeTransactions } from "@/modules/transactions/transactions.utils";

export type DashboardPeriod = "thisMonth" | "lastMonth" | "thisYear";

// one bar group of the charts: a week of the month, or a month of the year
export type Bucket = { key: string; label: string; income: number; expense: number; net: number };

const round2 = (n: number) => Math.round(n * 100) / 100;
const endOfDay = (y: number, m: number, d: number) => new Date(y, m, d, 23, 59, 59, 999);
const dayMonth = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// the period and the one before it, to compare with. the dates are worked out from "now" each time
export function getDashboardRanges(period: DashboardPeriod, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const month = (offset: number) => ({ from: new Date(y, m + offset, 1), to: endOfDay(y, m + offset + 1, 0) });

  if (period === "thisYear") {
    return {
      current: { from: new Date(y, 0, 1), to: endOfDay(y, 11, 31) },
      previous: { from: new Date(y - 1, 0, 1), to: endOfDay(y - 1, 11, 31) },
      previousLabel: "last year",
    };
  }
  if (period === "lastMonth") {
    return { current: month(-1), previous: month(-2), previousLabel: "the month before" };
  }
  return { current: month(0), previous: month(-1), previousLabel: "last month" };
}

// "1 Oct – 24 Oct 2026". a period that is not over yet ends today
export function formatDashboardRange(range: { from: Date; to: Date }, now = new Date()) {
  const to = range.to > now ? now : range.to;
  return `${dayMonth(range.from)} – ${dayMonth(to)} ${to.getFullYear()}`;
}

// null when there is nothing to compare with
export function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 1000) / 10;
}

// income and expense per week (a month) or per month (the year). archived ones are left out, same as everywhere
export function buildBuckets(list: Transaction[], period: DashboardPeriod, now = new Date()): Bucket[] {
  const counted = list.filter((t) => !t.isDeleted && !t.isArchived && (t.type === "income" || t.type === "expense"));
  const sum = (items: Transaction[]) => {
    const { income, expense, net } = summarizeTransactions(items);
    return { income, expense, net };
  };

  if (period === "thisYear") {
    const lastMonth = now.getMonth();
    return Array.from({ length: lastMonth + 1 }, (_, month) => {
      const items = counted.filter((t) => parseLocalDate(t.transactionDate).getMonth() === month);
      return {
        key: String(month),
        label: new Date(now.getFullYear(), month, 1).toLocaleDateString("en-GB", { month: "short" }),
        ...sum(items),
      };
    });
  }

  const base = period === "lastMonth" ? new Date(now.getFullYear(), now.getMonth() - 1, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const lastDay = period === "thisMonth" ? Math.min(now.getDate(), daysInMonth) : daysInMonth;
  const weeks: [number, number][] = [[1, 7], [8, 14], [15, 21], [22, lastDay]];

  return weeks
    .filter(([start]) => start <= lastDay)
    .map(([start, end]) => {
      const last = Math.min(end, lastDay);
      const items = counted.filter((t) => {
        const day = parseLocalDate(t.transactionDate).getDate();
        return day >= start && day <= last;
      });
      return { key: `${start}`, label: start === last ? String(start) : `${start}–${last}`, ...sum(items) };
    });
}

export type CategorySpend = { categoryId: string; amount: number };

// expense per category, biggest first
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

// a round top for the chart (25k, 50k, 75k, 100k) and the lines in between. the values can be negative (cash flow)
export function chartScale(values: number[], steps = 4) {
  const niceStep = (max: number) => {
    if (max <= 0) return 0;
    const raw = max / steps;
    const magnitude = 10 ** Math.floor(Math.log10(raw));
    const norm = raw / magnitude;
    return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * magnitude;
  };
  const maxValue = Math.max(0, ...values);
  const minValue = Math.min(0, ...values);
  const step = Math.max(niceStep(maxValue), niceStep(-minValue)) || 25;
  const top = Math.ceil(maxValue / step) * step || step * steps;
  const bottom = Math.floor(minValue / step) * step;
  const ticks: number[] = [];
  for (let v = bottom; v <= top + step / 2; v += step) ticks.push(round2(v));
  return { min: bottom, max: top, ticks };
}

// 75000 -> "75k", 100000 -> "1L"
export function formatAxis(value: number) {
  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);
  const trim = (n: number) => String(Math.round(n * 10) / 10);
  if (abs >= 100000) return `${sign}${trim(abs / 100000)}L`;
  if (abs >= 1000) return `${sign}${trim(abs / 1000)}k`;
  return `${sign}${abs}`;
}
