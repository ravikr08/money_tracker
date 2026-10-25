import { ChevronLeft, ChevronRight } from "lucide-react";
import { PLACEHOLDER_GROUPS, PLACEHOLDER_REMAINING, PLACEHOLDER_SHOWING } from "../transactions.placeholder";
import { ROW_COLUMNS } from "./TransactionRow";
import TransactionGroup from "./TransactionGroup";

function LoadMoreButton() {
    return (
        <button type="button" className="h-12 flex items-center justify-center gap-2 rounded-full border border-[#CBD5D2] bg-white text-sm font-semibold text-[#11201E] cursor-pointer">
            Load more <span className="font-medium text-[#5A6B68]">· {PLACEHOLDER_REMAINING}</span>
        </button>
    )
}

// the list of days. UI only, the buttons do nothing yet
// phone: blocks on the page and a "load more" button. tablet: one white table with "load more" and the count at the bottom.
// desktop: the same table with a header and page buttons at the bottom
export default function TransactionList(){
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

                {PLACEHOLDER_GROUPS.map(group => <TransactionGroup key={group.label} group={group} />)}

                {/* phone */}
                <div className="md:hidden flex flex-col"><LoadMoreButton /></div>

                {/* tablet */}
                <div className="hidden md:flex xl:hidden flex-col gap-3 px-5 py-3.5 border-t border-[#EEF2F0]">
                    <LoadMoreButton />
                    <span className="text-center text-[13px] text-[#5A6B68]">{PLACEHOLDER_SHOWING}</span>
                </div>

                {/* desktop */}
                <div className="hidden xl:flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-[#EEF2F0]">
                    <span className="text-[13px] text-[#5A6B68]">{PLACEHOLDER_SHOWING}</span>
                    <div className="flex items-center gap-1.5">
                        <button type="button" aria-label="Previous page" className="size-10 grid place-items-center rounded-full border border-[#E1E8E6] bg-white text-[#5A6B68] cursor-pointer"><ChevronLeft size={18} /></button>
                        <button type="button" aria-label="Page 1" aria-current="page" className="min-w-10 h-10 px-2 rounded-full bg-[#0B1F1C] text-white text-sm font-semibold cursor-pointer">1</button>
                        <button type="button" aria-label="Page 2" className="min-w-10 h-10 px-2 rounded-full text-[#11201E] text-sm font-semibold cursor-pointer">2</button>
                        <button type="button" aria-label="Next page" className="size-10 grid place-items-center rounded-full border border-[#E1E8E6] bg-white text-[#5A6B68] cursor-pointer"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>
        </section>
    )
}
