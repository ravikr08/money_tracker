import { List, Plus, Search } from "lucide-react";
import { ACCOUNT_OPTIONS, CATEGORY_OPTIONS, PERIOD_OPTIONS, PLACEHOLDER_RANGE, TYPE_OPTIONS, VIEW_OPTIONS } from "../transactions.placeholder";
import { AmountFilter, FilterDropdown } from "./TransactionsFilters";

// phone: [search] [view] and the filters under them (the new button is the round one in the corner)
// tablet: [search] [view] [new transaction] and the filters under them
// desktop: everything in one row
// `order` puts the pieces in these places, the filters group uses `contents` on desktop so its buttons join the row
export default function TransactionsToolbar() {
    return (
        <>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 xl:gap-2.5">
                <label className="order-1 flex-1 basis-[200px] xl:basis-[300px] min-w-0 h-12 flex items-center gap-2.5 px-4 rounded-full bg-white text-[#5A6B68]">
                    <Search size={18} className="shrink-0" />
                    <input type="search" placeholder="Search by title or notes" aria-label="Search transactions" className="flex-1 min-w-0 border-0 outline-0 bg-transparent text-sm text-[#11201E]" />
                </label>

                <div className="order-2">
                    <FilterDropdown label="Daily" options={VIEW_OPTIONS} selected="Daily" align="end" buttonClass="h-12 text-sm" before={<List size={18} />} />
                </div>

                <button type="button" className="order-3 xl:order-4 hidden md:flex h-12 items-center gap-2 px-5 rounded-full bg-[#0E7C6B] hover:bg-[#0A6B5C] text-white text-sm font-semibold whitespace-nowrap cursor-pointer">
                    <Plus size={18} strokeWidth={2.2} />
                    New Transaction
                </button>

                <div className="order-4 xl:order-none basis-full xl:basis-auto flex flex-wrap items-center gap-2 xl:contents">
                    <div className="xl:order-3"><FilterDropdown label="This month" options={PERIOD_OPTIONS} selected="This month" /></div>
                    <div className="xl:order-3"><FilterDropdown label="Type" options={TYPE_OPTIONS} selected="All types" /></div>
                    <div className="xl:order-3"><FilterDropdown label="Account" options={ACCOUNT_OPTIONS} selected="All accounts" align="end" /></div>
                    <div className="xl:order-3"><FilterDropdown label="Category" options={CATEGORY_OPTIONS} selected="All categories" /></div>
                    <div className="xl:order-3"><AmountFilter /></div>
                </div>
            </div>

            <span className="hidden md:block text-[13px] text-[#5A6B68]">{PLACEHOLDER_RANGE}</span>
        </>
    )
}
