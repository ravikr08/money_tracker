import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatCurrency } from "@/shared/utils/utils";
import { percentChange } from "../dashboard.utils";

type Totals = { income: number; expense: number; net: number };

// the chip shows how much a number moved against the period before. `goodWhenUp` is false for the expense: spending more is not good news
function Chip({ change, goodWhenUp = true }: { change: number | null; goodWhenUp?: boolean }) {
    if (change === null) return null;
    const up = change >= 0;
    const good = up === goodWhenUp;
    const Icon = up ? ArrowUpRight : ArrowDownRight;
    return (
        <span className={cn("inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full type-caption font-semibold", good ? "bg-[#DDF3EE] text-[#0A5F52]" : "bg-[#FFEFE6] text-[#B4531A]")}>
            <Icon size={12} strokeWidth={2.4} />
            {up ? "+" : "−"}{Math.abs(change)}%
        </span>
    )
}

type CardProps = { title: string; value: string; caption: string; chip?: React.ReactNode; dark?: boolean; className?: string }

function Card({ title, value, caption, chip, dark, className }: CardProps) {
    return (
        <div className={cn("flex flex-col gap-2 px-[18px] py-4 xl:px-6 xl:py-5 rounded-[22px] xl:rounded-3xl", dark ? "bg-[#0B1F1C] text-white" : "bg-white", className)}>
            <span className={cn("type-body font-medium", dark ? "text-white/80" : "text-[#5A6B68]")}>{title}</span>
            <b className="type-stat font-bold tracking-tight whitespace-nowrap">{value}</b>
            {chip && <div>{chip}</div>}
            <span className={cn("type-label", dark ? "text-white/70" : "text-[#5A6B68]")}>{caption}</span>
        </div>
    )
}

type BalanceCardsProps = {
    current: Totals;
    previous: Totals;
    previousLabel: string;
}

// phone: the balance, then income and expense side by side. tablet and desktop: three cards in a row
// the total balance is the net cash flow (income − expense) of the period, the same number the transaction service gives everywhere (getCashFlow)
export default function BalanceCards({ current, previous, previousLabel }: BalanceCardsProps) {
    const vs = (previousValue: number) => previousValue === 0 && current.income + current.expense > 0 ? `No data for ${previousLabel}` : `vs ${formatCurrency(previousValue)} ${previousLabel}`;
    return (
        <section aria-label="Summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:gap-4">
            <Card dark title="Total Balance" value={formatCurrency(current.net)} chip={<Chip change={percentChange(current.net, previous.net)} />} caption={vs(previous.net)} className="col-span-2 md:col-span-1" />
            <Card title="Income" value={formatCurrency(current.income)} chip={<Chip change={percentChange(current.income, previous.income)} />} caption={vs(previous.income)} />
            <Card title="Expense" value={formatCurrency(current.expense)} chip={<Chip change={percentChange(current.expense, previous.expense)} goodWhenUp={false} />} caption={vs(previous.expense)} />
        </section>
    )
}
