import { useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Popover } from "@base-ui/react/popover";
import { Check, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import type { FilterOption } from "../transactions.placeholder";
import { transactionServices } from "../transaction.services";
import { selectTransactionFilters } from "../transactions.selectors";

const panelClass = "rounded-2xl bg-white border border-[#E1E8E6] shadow-[0_12px_32px_rgba(17,32,30,0.18)] ring-0";

// a button that opens a list of options. `selected` is the value (or the label, when an option has no value) that looks ticked
type FilterDropdownProps = {
    label: string;
    options: FilterOption[];
    selected: string;
    onSelect?: (option: FilterOption) => void;
    // the button content before the label, for example an icon
    before?: ReactNode;
    buttonClass?: string;
    align?: "start" | "end";
}

export function FilterDropdown({ label, options, selected, onSelect, before, buttonClass, align = "start" }: FilterDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn("h-11 flex items-center gap-2 px-3.5 rounded-full bg-white type-label font-semibold text-[#11201E] whitespace-nowrap cursor-pointer", buttonClass)}
                aria-label={label}
            >
                {before}
                {label}
                <ChevronDown size={16} className="opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} sideOffset={6} className={cn(panelClass, "min-w-[210px] max-h-80 overflow-y-auto p-1.5")}>
                {options.map(option => {
                    const key = option.value ?? option.label;
                    const isSelected = key === selected;
                    return (
                        <DropdownMenuItem
                            key={key}
                            onClick={() => onSelect?.(option)}
                            className={cn("min-h-11 flex items-center justify-between gap-3 px-3 py-1.5 rounded-[10px] type-body cursor-pointer", isSelected ? "bg-[#DDF3EE] text-[#0A5F52] font-semibold" : "text-[#3C4C49] font-medium")}
                        >
                            <span className="flex flex-col gap-px min-w-0">
                                <span>{option.label}</span>
                                {option.sub && <span className="type-micro font-medium text-[#5A6B68]">{option.sub}</span>}
                            </span>
                            {isSelected && <Check size={16} className="shrink-0" />}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// the amount filter is not a list, it opens a small box with a minimum and a maximum
export function AmountFilter() {
    const applied = useSelector(selectTransactionFilters);
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    // empty box = no limit
    const toNumber = (text: string) => {
        const n = parseFloat(text);
        return text.trim() !== "" && !Number.isNaN(n) ? n : null;
    };
    const handleOpenChange = (open: boolean) => {
        if (!open) return;
        setMin(applied.amountMin === null ? "" : String(applied.amountMin));
        setMax(applied.amountMax === null ? "" : String(applied.amountMax));
    };
    const handleApply = () => {
        transactionServices.updateFilters({ amountMin: toNumber(min), amountMax: toNumber(max) });
    };

    return (
        <Popover.Root onOpenChange={handleOpenChange}>
            <Popover.Trigger className="h-11 flex items-center gap-2 px-3.5 rounded-full bg-white type-label font-semibold text-[#11201E] whitespace-nowrap cursor-pointer">
                Amount{(applied.amountMin !== null || applied.amountMax !== null) && " •"}
                <ChevronDown size={16} className="opacity-70" />
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner align="end" sideOffset={6} className="z-50">
                    <Popover.Popup className={cn(panelClass, "w-70 p-3.5 flex flex-col gap-3 outline-none")}>
                        <span className="type-label font-semibold text-[#11201E]">Amount range</span>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="h-11 flex items-center gap-1 px-3 rounded-xl border border-[#CBD5D2] type-label text-[#5A6B68]">
                                Min ₹
                                <input type="text" inputMode="decimal" placeholder="0" aria-label="Minimum amount" value={min} onChange={e => setMin(e.target.value)} className="flex-1 min-w-0 border-0 outline-0 type-body text-[#11201E]" />
                            </label>
                            <label className="h-11 flex items-center gap-1 px-3 rounded-xl border border-[#CBD5D2] type-label text-[#5A6B68]">
                                Max ₹
                                <input type="text" inputMode="decimal" placeholder="Any" aria-label="Maximum amount" value={max} onChange={e => setMax(e.target.value)} className="flex-1 min-w-0 border-0 outline-0 type-body text-[#11201E]" />
                            </label>
                        </div>
                        <Popover.Close onClick={handleApply} className="h-11 rounded-full bg-[#0E7C6B] text-white type-body font-semibold cursor-pointer">Apply</Popover.Close>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}
