import { useState } from "react";
import { useSelector } from "react-redux";
import { ROW_COLUMNS } from "./TransactionRow";
import TransactionGroup from "./TransactionGroup";
import { selectTransactionGroups } from "../transactions.selectors";
import { transactionServices } from "../transaction.services";
import type { TransactionGroupData } from "../transactions.utils";

const PAGE_SIZE = 10;

// the first `limit` rows, cut at the group borders (the last group can be cut in the middle)
function limitGroups(groups: TransactionGroupData[], limit: number) {
    let left = limit;
    const result: TransactionGroupData[] = [];
    for (const group of groups) {
        if (left <= 0) break;
        result.push(group.rows.length <= left ? group : { ...group, rows: group.rows.slice(0, left) });
        left -= group.rows.length;
    }
    return result;
}

function LoadMoreButton({ remaining, onClick }: { remaining: number, onClick: () => void }) {
    if (remaining <= 0) return null;
    return (
        <button type="button" onClick={onClick} className="h-12 flex items-center justify-center gap-2 rounded-full border border-[#CBD5D2] bg-white text-sm font-semibold text-[#11201E] cursor-pointer">
            Load more <span className="font-medium text-[#5A6B68]">· {remaining} more</span>
        </button>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
            <b className="text-base text-[#11201E]">No transactions found</b>
            <span className="text-sm text-[#5A6B68]">Nothing matches the filters you picked.</span>
            <button type="button" onClick={() => transactionServices.resetFilters()} className="h-11 px-5 rounded-full border border-[#CBD5D2] bg-white text-sm font-semibold text-[#11201E] cursor-pointer">Reset filters</button>
        </div>
    )
}

// the list of days (or weeks, or months, depending on the view)
// phone: blocks on the page and a "load more" button. tablet: one white table with "load more" and the count at the bottom.
// desktop: the same table with a header, the count and "load more" at the bottom
export default function TransactionList(){
    const groups = useSelector(selectTransactionGroups);
    const [limit, setLimit] = useState(PAGE_SIZE);

    // a new filter gives a new list, start from the first page again
    const [seenGroups, setSeenGroups] = useState(groups);
    if (seenGroups !== groups) {
        setSeenGroups(groups);
        setLimit(PAGE_SIZE);
    }

    const total = groups.reduce((sum, group) => sum + group.rows.length, 0);
    const shown = Math.min(limit, total);
    const remaining = total - shown;
    const loadMore = () => setLimit(prev => prev + PAGE_SIZE);

    return(
        <section className="flex flex-col gap-4 md:gap-0 md:rounded-3xl md:bg-white md:overflow-x-auto">
            <div className="flex flex-col gap-4 md:gap-0 xl:min-w-[960px]">
                <div role="row" className={`hidden xl:grid ${ROW_COLUMNS} pt-4 pr-3 pb-3 pl-5 text-xs font-semibold tracking-[0.05em] text-[#5A6B68]`}>
                    <span></span>
                    <span>TRANSACTION</span>
                    <span>CATEGORY</span>
                    <span>ACCOUNT</span>
                    <span>DATE</span>
                    <span className="text-right">AMOUNT</span>
                    <span></span>
                </div>

                {total === 0 ? <EmptyState /> : limitGroups(groups, limit).map(group => <TransactionGroup key={group.key} group={group} />)}

                {total > 0 && <>
                    {/* phone */}
                    <div className="md:hidden flex flex-col"><LoadMoreButton remaining={remaining} onClick={loadMore} /></div>

                    {/* tablet */}
                    <div className="hidden md:flex xl:hidden flex-col gap-3 px-5 py-3.5 border-t border-[#EEF2F0]">
                        <LoadMoreButton remaining={remaining} onClick={loadMore} />
                        <span className="text-center text-[13px] text-[#5A6B68]">Showing {shown} of {total}</span>
                    </div>

                    {/* desktop */}
                    <div className="hidden xl:flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-[#EEF2F0]">
                        <span className="text-[13px] text-[#5A6B68]">Showing {shown} of {total}</span>
                        <div className="w-60"><LoadMoreButton remaining={remaining} onClick={loadMore} /></div>
                    </div>
                </>}
            </div>
        </section>
    )
}
