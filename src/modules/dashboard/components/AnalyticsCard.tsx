import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatCurrency } from "@/shared/utils/utils";
import TabMenu from "@/shared/components/TabMenu";
import type { CategorySpend } from "@/modules/transactions/transactions.utils";
import { chartScale, formatAxis, type Bucket } from "../dashboard.utils";

type ChartKey = "compare" | "category" | "cashflow";
const TABS: { value: ChartKey; label: string }[] = [
    { value: "compare", label: "Income vs expense" },
    { value: "category", label: "By category" },
    { value: "cashflow", label: "Cash flow" },
];

const INCOME_COLOR = "#0E7C6B";
const EXPENSE_COLOR = "#F28C5B";
const CHART_HEIGHT = "h-[176px] xl:h-[208px]";

// bars drawn with plain boxes, so they follow the width of the card. `compare` has an income and an expense bar per group, `net` one bar that can go below the line
function BarChart({ buckets, mode }: { buckets: Bucket[]; mode: "compare" | "net" }) {
    const values = mode === "net" ? buckets.map(b => b.net) : buckets.flatMap(b => [b.income, b.expense]);
    const scale = chartScale(values);
    const span = scale.max - scale.min;
    const at = (value: number) => ((value - scale.min) / span) * 100;
    const bar = (value: number, color: string, offset: string, width: string) => (
        <span
            key={color + offset}
            className="absolute rounded-t-[4px]"
            style={{ left: offset, width, backgroundColor: color, bottom: `${at(Math.min(value, 0))}%`, height: `${(Math.abs(value) / span) * 100}%`, minHeight: value === 0 ? 0 : 2 }}
        />
    );
    const summary = buckets.map(b => `${b.label}: income ${formatCurrency(b.income)}, expense ${formatCurrency(b.expense)}`).join("; ");

    return (
        <div className="flex gap-2" role="img" aria-label={summary}>
            <div className={cn("relative w-9 shrink-0", CHART_HEIGHT)}>
                {scale.ticks.map(tick => (
                    <span key={tick} className="absolute right-0 translate-y-1/2 type-micro text-[#5A6B68]" style={{ bottom: `${at(tick)}%` }}>{formatAxis(tick)}</span>
                ))}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className={cn("relative", CHART_HEIGHT)}>
                    {scale.ticks.map(tick => (
                        <span key={tick} className={cn("absolute inset-x-0 border-t", tick === 0 ? "border-[#CBD5D2]" : "border-dashed border-[#E6ECEA]")} style={{ bottom: `${at(tick)}%` }} />
                    ))}
                    <div className="absolute inset-0 flex">
                        {buckets.map(b => (
                            <div key={b.key} className="relative flex-1">
                                {mode === "net"
                                    ? bar(b.net, b.net >= 0 ? INCOME_COLOR : EXPENSE_COLOR, "calc(50% - 10px)", "20px")
                                    : <>
                                        {bar(b.income, INCOME_COLOR, "calc(50% - 14px)", "12px")}
                                        {bar(b.expense, EXPENSE_COLOR, "calc(50% + 2px)", "12px")}
                                    </>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex">
                    {buckets.map(b => <span key={b.key} className="flex-1 text-center type-micro text-[#5A6B68]">{b.label}</span>)}
                </div>
            </div>
        </div>
    )
}

type CategoryInfo = { id: string; name: string; color: string };

// the biggest five, everything else is one "Others" row
function CategoryBars({ spend, categories, total }: { spend: CategorySpend[]; categories: CategoryInfo[]; total: number }) {
    if (total === 0) return <p className="py-10 text-center type-body text-[#5A6B68]">No expenses in this period.</p>;

    const rows = spend.slice(0, 5).map(s => {
        const cat = categories.find(c => c.id === s.categoryId);
        return { key: s.categoryId, name: cat?.name ?? "Other", color: cat?.color ?? "#94A3B8", amount: s.amount };
    });
    // everything after the first five is one "Others" row. what the first five add up to is taken from the total, not added again
    const rest = Math.round((total - rows.reduce((sum, row) => sum + row.amount, 0)) * 100) / 100;
    if (rest > 0) rows.push({ key: "others", name: "Others", color: "#94A3B8", amount: rest });

    return (
        <ul className="flex flex-col gap-3.5 py-1">
            {rows.map(row => {
                const share = Math.round((row.amount / total) * 100);
                return (
                    <li key={row.key} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-3 type-body">
                            <span className="flex items-center gap-2 min-w-0"><span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.color }} /><span className="font-semibold truncate">{row.name}</span></span>
                            <span className="shrink-0"><b>{formatCurrency(row.amount)}</b> <span className="text-[#5A6B68]">· {share}%</span></span>
                        </div>
                        <span className="h-2 rounded-full bg-[#EEF3F1] overflow-hidden"><span className="block h-full rounded-full" style={{ width: `${share}%`, backgroundColor: row.color }} /></span>
                    </li>
                )
            })}
        </ul>
    )
}

type AnalyticsCardProps = {
    periodLabel: string;
    rangeLabel: string;
    buckets: Bucket[];
    spend: CategorySpend[];
    categories: CategoryInfo[];
    income: number;
    expense: number;
    // income − expense, given by the transaction service (getCashFlow)
    net: number;
}

export default function AnalyticsCard({ periodLabel, rangeLabel, buckets, spend, categories, income, expense, net }: AnalyticsCardProps) {
    const [chart, setChart] = useState<ChartKey>("compare");
    const legend = (color: string, label: string, value: number) => (
        <span className="inline-flex items-center gap-1.5 type-caption text-[#5A6B68]"><span className="size-2 rounded-full" style={{ backgroundColor: color }} />{label} <b className="text-[#11201E]">{formatCurrency(value)}</b></span>
    );

    return (
        <section aria-label="Analytics" className="flex flex-col gap-3.5 p-4 xl:p-6 rounded-[22px] xl:rounded-3xl bg-white">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                    <h2 className="type-section-title font-bold">Analytics</h2>
                    <span className="type-caption text-[#5A6B68]">{periodLabel} · {rangeLabel}</span>
                </div>
                <Link to="/analytics" className="shrink-0 inline-flex items-center gap-0.5 type-label font-semibold text-[#0E7C6B]">Open Analytics <ChevronRight size={15} /></Link>
            </div>

            <TabMenu
                tabs={TABS}
                selectedTab={chart}
                onTabChange={setChart}
                bgClass="h-auto w-full md:w-fit p-1 rounded-2xl bg-[#F2F5F4] overflow-x-auto [scrollbar-width:none]!"
                btnActiveClass="h-9 flex-1 md:flex-none px-1 md:px-3.5 py-0 rounded-xl type-label font-semibold whitespace-nowrap data-active:bg-[#0B1F1C]"
            />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {chart === "compare" && <>{legend(INCOME_COLOR, "Income", income)}{legend(EXPENSE_COLOR, "Expense", expense)}</>}
                {chart === "category" && legend(EXPENSE_COLOR, "Total expense", expense)}
                {chart === "cashflow" && legend(INCOME_COLOR, "Net cash flow", net)}
            </div>

            {chart === "compare" && <BarChart buckets={buckets} mode="compare" />}
            {chart === "cashflow" && <BarChart buckets={buckets} mode="net" />}
            {chart === "category" && <CategoryBars spend={spend} categories={categories} total={expense} />}
        </section>
    )
}
