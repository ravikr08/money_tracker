import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useSelector } from "react-redux";
import { formatCurrency } from "@/shared/utils/utils";
import { selectPeriodRangeLabel, selectTransactionSummary } from "../transactions.selectors";
import { formatSigned } from "../transactions.utils";

type SummaryCardProps = {
    title: string;
    value: string;
    caption: string;
    icon: LucideIcon;
    // colours of the round icon tile and of the value
    iconClass: string;
    valueClass?: string;
    dark?: boolean;
}

function SummaryCard({ title, value, caption, icon: Icon, iconClass, valueClass, dark }: SummaryCardProps) {
    return (
        <div className={cn("flex flex-col gap-2 px-[18px] py-4 xl:px-6 xl:py-5 rounded-[22px] xl:rounded-3xl", dark ? "bg-[#0B1F1C] text-white" : "bg-white")}>
            <div className="flex items-center justify-between gap-2">
                <span className={cn("type-body font-medium", dark ? "text-white/80" : "text-[#5A6B68]")}>{title}</span>
                <span className={cn("size-[34px] shrink-0 grid place-items-center rounded-full", iconClass)}><Icon size={16} strokeWidth={2} /></span>
            </div>
            <b className={cn("type-stat font-bold tracking-tight whitespace-nowrap", valueClass)}>{value}</b>
            <span className={cn("type-label", dark ? "text-white/70" : "text-[#5A6B68]")}>{caption}</span>
        </div>
    )
}

// the numbers are of the transactions the filters give
// phone: one dark card with three small boxes. tablet and desktop: four cards
export default function TransactionsSummary() {
    const summary = useSelector(selectTransactionSummary);
    const range = useSelector(selectPeriodRangeLabel);
    const s = {
        income: { value: "+" + formatCurrency(summary.income), caption: range },
        expense: { value: "−" + formatCurrency(summary.expense), caption: "Transfers excluded" },
        net: { value: formatSigned(summary.net), caption: "Income − expense" },
        count: { value: String(summary.count), caption: "In this period" },
    };
    return (
        <>
            <section aria-label="Summary" className="md:hidden flex flex-col gap-2.5 px-[18px] py-4 rounded-[22px] bg-[#0B1F1C] text-white">
                <div className="flex items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="type-micro font-semibold tracking-[0.06em] text-white/70">NET CASH FLOW</span>
                        <b className="type-display font-bold tracking-tight">{s.net.value}</b>
                    </div>
                    <span className="type-caption text-white/70 text-right">{range}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-0.5 px-3 py-2.5 rounded-[14px] bg-white/8">
                        <span className="type-micro text-white/70">Income</span>
                        <b className="type-body text-[#6EE7C0]">{s.income.value}</b>
                    </div>
                    <div className="flex flex-col gap-0.5 px-3 py-2.5 rounded-[14px] bg-white/8">
                        <span className="type-micro text-white/70">Expense</span>
                        <b className="type-body text-[#FFB48F]">{s.expense.value}</b>
                    </div>
                    <div className="flex flex-col gap-0.5 px-3 py-2.5 rounded-[14px] bg-white/8">
                        <span className="type-micro text-white/70">Transactions</span>
                        <b className="type-body">{s.count.value}</b>
                    </div>
                </div>
            </section>

            <section aria-label="Summary" className="hidden md:grid grid-cols-4 gap-2.5 xl:gap-4">
                <SummaryCard title="Total Income" value={s.income.value} caption={s.income.caption} icon={ArrowDownLeft} iconClass="bg-[#DDF3EE] text-[#0A5F52]" valueClass="text-[#0B7A4B]" />
                <SummaryCard title="Total Expense" value={s.expense.value} caption={s.expense.caption} icon={ArrowUpRight} iconClass="bg-[#FFEFE6] text-[#B4531A]" />
                <SummaryCard title="Net Cash Flow" value={s.net.value} caption={s.net.caption} icon={TrendingUp} iconClass="bg-white/12 text-white" dark />
                <SummaryCard title="Transactions" value={s.count.value} caption={s.count.caption} icon={ArrowLeftRight} iconClass="bg-[#E6EAFF] text-[#2A3BC4]" />
            </section>
        </>
    )
}
