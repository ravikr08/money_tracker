import { useMemo } from "react";
import { useSelector } from "react-redux";
import { List, Plus, Search } from "lucide-react";
import type { FilterOption } from "../transactions.placeholder";
import { DEFAULT_TRANSACTION_FILTERS, TRANSACTION_EDIT_HANDLE, PERIOD_OPTIONS, TYPE_OPTIONS, VIEW_OPTIONS } from "../transactions.constants";
import { selectPeriodRangeLabel, selectTransactionFilters } from "../transactions.selectors";
import { transactionServices } from "../transaction.services";
import type { PeriodKey, TransactionFiltersState, ViewKey } from "../transaction.model";
import { selectSortedAccounts, selectSortedCreditCards } from "@/modules/accounts/accounts.selectors";
import { categoryServices } from "@/modules/category/category.services";
import { AmountFilter, FilterDropdown } from "./TransactionsFilters";

const labelOf = (options: FilterOption[], value: string) => options.find(o => (o.value ?? o.label) === value)?.label ?? "";

// phone: [search] [view] and the filters under them (the new button is the round one in the corner)
// tablet: [search] [view] [new transaction] and the filters under them
// desktop: everything in one row
// `order` puts the pieces in these places, the filters group uses `contents` on desktop so its buttons join the row
export default function TransactionsToolbar() {
    const filters = useSelector(selectTransactionFilters);
    const range = useSelector(selectPeriodRangeLabel);
    const accounts = useSelector(selectSortedAccounts);
    const creditCards = useSelector(selectSortedCreditCards);
    // the category list is read once, the toolbar re-renders anyway when the filters change
    const categories = categoryServices.getAllCategories();

    const accountOptions = useMemo<FilterOption[]>(() => [
        { value: "all", label: "All accounts" },
        ...accounts.filter(acc => acc.status !== "deleted").map(acc => ({ value: acc.id, label: acc.name })),
        ...creditCards.filter(card => card.status !== "deleted").map(card => ({ value: card.id, label: card.name, sub: "Credit card" })),
    ], [accounts, creditCards]);
    const categoryOptions = useMemo<FilterOption[]>(() => [
        { value: "all", label: "All categories" },
        ...categories.filter(cat => cat.status === "active").map(cat => ({ value: cat.id, label: cat.name })),
    ], [categories]);

    const setFilters = (updates: Partial<TransactionFiltersState>) => transactionServices.updateFilters(updates);

    // the calendar has no filter buttons, so going to it sets them back to the default (the search text stays)
    function handleViewSelect(option: FilterOption) {
        const view = option.value as ViewKey;
        setFilters(view === "calendar" ? { ...DEFAULT_TRANSACTION_FILTERS, search: filters.search, view } : { view });
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 xl:gap-2.5">
                <label className="order-1 flex-1 basis-[200px] xl:basis-[300px] min-w-0 h-12 flex items-center gap-2.5 px-4 rounded-full bg-white text-[#5A6B68]">
                    <Search size={18} className="shrink-0" />
                    <input type="search" value={filters.search} onChange={e => setFilters({ search: e.target.value })} placeholder="Search by title or notes" aria-label="Search transactions" className="flex-1 min-w-0 border-0 outline-0 bg-transparent text-sm text-[#11201E]" />
                </label>

                <div className="order-2">
                    <FilterDropdown label={labelOf(VIEW_OPTIONS, filters.view)} options={VIEW_OPTIONS} selected={filters.view} onSelect={handleViewSelect} align="end" buttonClass="h-12 text-sm" before={<List size={18} />} />
                </div>

                <button type="button" onClick={() => TRANSACTION_EDIT_HANDLE.openWithPayload({})} className="order-3 xl:order-4 hidden md:flex h-12 items-center gap-2 px-5 rounded-full bg-[#0E7C6B] hover:bg-[#0A6B5C] text-white text-sm font-semibold whitespace-nowrap cursor-pointer">
                    <Plus size={18} strokeWidth={2.2} />
                    New Transaction
                </button>

                {/* the calendar design has only the search and the view, the filter buttons are hidden there */}
                {filters.view !== "calendar" && <div className="order-4 xl:order-none basis-full xl:basis-auto flex flex-wrap items-center gap-2 xl:contents">
                    <div className="xl:order-3"><FilterDropdown label={labelOf(PERIOD_OPTIONS, filters.period)} options={PERIOD_OPTIONS} selected={filters.period} onSelect={o => setFilters({ period: o.value as PeriodKey })} /></div>
                    <div className="xl:order-3"><FilterDropdown label={labelOf(TYPE_OPTIONS, filters.type)} options={TYPE_OPTIONS} selected={filters.type} onSelect={o => setFilters({ type: o.value as TransactionFiltersState["type"] })} /></div>
                    <div className="xl:order-3"><FilterDropdown label={labelOf(accountOptions, filters.accountId) || "Account"} options={accountOptions} selected={filters.accountId} onSelect={o => setFilters({ accountId: o.value ?? "all" })} align="end" /></div>
                    <div className="xl:order-3"><FilterDropdown label={labelOf(categoryOptions, filters.categoryId) || "Category"} options={categoryOptions} selected={filters.categoryId} onSelect={o => setFilters({ categoryId: o.value ?? "all" })} /></div>
                    <div className="xl:order-3"><AmountFilter /></div>
                </div>}
            </div>

            <span className="hidden md:block text-[13px] text-[#5A6B68]">{range}</span>
        </>
    )
}
