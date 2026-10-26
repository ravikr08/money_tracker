import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { FilterDropdown } from "@/modules/transactions/components/TransactionsFilters";
import TransactionCompactRow from "@/modules/transactions/components/TransactionCompactRow";
import { transactionServices } from "@/modules/transactions/transaction.services";
import { selectTransactions } from "@/modules/transactions/transactions.selectors";
import { getPeriodRange, sortNewestFirst } from "@/modules/transactions/transactions.utils";
import type { Transaction } from "@/modules/transactions/transaction.model";
import { RECENT_FILTER_OPTIONS, RECENT_LIMIT, type RecentFilter } from "../dashboard.constants";

const labelOf = (value: RecentFilter) => RECENT_FILTER_OPTIONS.find(o => o.value === value)?.label ?? "";

// the newest ones first, found with the same filter of the transaction service as the transactions page. "Income" and "Expense" look at the last 30 days
function pickRecent(list: Transaction[], filter: RecentFilter) {
    const period = filter === "today" ? "today" : filter === "last7" ? "last7" : "last30";
    const query = { ...getPeriodRange(period), ...(filter === "income" || filter === "expense" ? { type: filter } : {}) };
    return sortNewestFirst(transactionServices.filterTransactions(list, query)).slice(0, RECENT_LIMIT);
}

export default function RecentTransactions() {
    const transactions = useSelector(selectTransactions);
    const [filter, setFilter] = useState<RecentFilter>("last7");
    const rows = useMemo(() => pickRecent(transactions, filter), [transactions, filter]);

    return (
        <section aria-label="Recent transactions" className="flex flex-col gap-2 p-4 xl:p-6 rounded-[22px] xl:rounded-3xl bg-white">
            <div className="flex items-center justify-between gap-3">
                <h2 className="type-section-title font-bold">Recent transactions</h2>
                <FilterDropdown label={labelOf(filter)} options={RECENT_FILTER_OPTIONS} selected={filter} onSelect={o => setFilter(o.value as RecentFilter)} align="end" buttonClass="h-10 bg-[#F2F5F4]" />
            </div>

            {rows.length === 0 ? (
                <p className="py-8 text-center type-body text-[#5A6B68]">No transactions for this filter.</p>
            ) : (
                <ul className="flex flex-col divide-y divide-[#EEF2F0]">
                    {rows.map(t => (
                        <li key={t.id}>
                            <TransactionCompactRow transaction={t} className="py-3" />
                        </li>
                    ))}
                </ul>
            )}

            <Link to="/transactions" className="self-center mt-1 inline-flex items-center gap-1 type-body font-semibold text-[#0E7C6B]">
                View all <ChevronRight size={16} />
            </Link>
        </section>
    )
}
