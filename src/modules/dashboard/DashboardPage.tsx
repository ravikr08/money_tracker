import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CalendarDays } from "lucide-react";
import type { RootState } from "@/app/app.store";
import { FilterDropdown } from "@/modules/transactions/components/TransactionsFilters";
import { transactionServices } from "@/modules/transactions/transaction.services";
import { selectTransactions } from "@/modules/transactions/transactions.selectors";
import { TransactionDeleteDialog, TransactionEditDialog } from "@/modules/transactions/components/TransactionDialogs";
import TransactionDetailsDrawer from "@/modules/transactions/components/TransactionDetailsDrawer";
import QuickActions from "./components/QuickActions";
import DashboardAddMenu from "./components/DashboardAddMenu";
import BalanceCards from "./components/BalanceCards";
import AnalyticsCard from "./components/AnalyticsCard";
import RecentTransactions from "./components/RecentTransactions";
import { DASHBOARD_PERIOD_OPTIONS } from "./dashboard.constants";
import { buildBuckets, formatDashboardRange, getDashboardRanges, type DashboardPeriod } from "./dashboard.utils";

// the title is in the header of the app. the filter at the top sets the period of the cards and of the analytics,
// the recent transactions have their own filter
export default function DashboardPage() {
    const [period, setPeriod] = useState<DashboardPeriod>("thisMonth");
    const transactions = useSelector(selectTransactions);
    const categories = useSelector((state: RootState) => state.categorySlice.categories);

    const data = useMemo(() => {
        const ranges = getDashboardRanges(period);
        // none of the numbers are added up here (income, expense, net cash flow, what was spent per category),
        // the transaction service gives them, the same as to every other module. the total balance card shows the net cash flow
        return {
            rangeLabel: formatDashboardRange(ranges.current),
            previousLabel: ranges.previousLabel,
            current: transactionServices.getCashFlow(ranges.current),
            previous: transactionServices.getCashFlow(ranges.previous),
            buckets: buildBuckets(period),
            spend: transactionServices.getExpenseByCategory(ranges.current),
        };
        // the service reads the store itself, so the list is here to run it again when a transaction changes
    }, [transactions, period]);

    const periodLabel = DASHBOARD_PERIOD_OPTIONS.find(o => o.value === period)?.label ?? "";

    return (
        <div className="flex flex-col gap-4 xl:gap-5">
            {/* phone: only the period (the round + button floats over the page). tablet and desktop: the three buttons on the left, the period on the right */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="order-1 md:order-2 flex items-center justify-between gap-3 md:justify-end md:gap-4">
                    {/* not on the tablet, there is no room next to the three buttons */}
                    <span className="md:hidden lg:inline type-label text-[#5A6B68] whitespace-nowrap">{data.rangeLabel}</span>
                    <FilterDropdown label={periodLabel} options={DASHBOARD_PERIOD_OPTIONS} selected={period} onSelect={o => setPeriod(o.value as DashboardPeriod)} align="end" before={<CalendarDays size={16} />} />
                </div>
                <QuickActions className="order-2 md:order-1" />
            </div>

            <BalanceCards current={data.current} previous={data.previous} previousLabel={data.previousLabel} />

            {/* phone and tablet: one under the other. desktop: side by side, the chart gets the wider part */}
            <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-5">
                <AnalyticsCard periodLabel={periodLabel} rangeLabel={data.rangeLabel} buckets={data.buckets} spend={data.spend} categories={categories} income={data.current.income} expense={data.current.expense} net={data.current.net} />
                <RecentTransactions />
            </div>

            <DashboardAddMenu />
            <TransactionDetailsDrawer />
            <TransactionEditDialog />
            <TransactionDeleteDialog />
        </div>
    )
}
