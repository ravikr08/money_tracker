import { cn } from "@/shared/lib/utils";
import { KINDS } from "@/modules/transactions/components/TransactionRow";
import { TRANSACTION_EDIT_HANDLE } from "@/modules/transactions/transactions.constants";
import type { TransactionTypes } from "@/modules/transactions/transaction.model";

const ACTIONS: { type: TransactionTypes; label: string }[] = [
    { type: "income", label: "Add Income" },
    { type: "expense", label: "Add Expense" },
    { type: "transfer", label: "Transfer" },
];

// each one opens the new transaction form with its type picked
// tablet and desktop: three pills in a row. the phone has the round + button instead (DashboardAddMenu)
export default function QuickActions({ className }: { className?: string }) {
    return (
        <div className={cn("hidden md:flex md:gap-2", className)}>
            {ACTIONS.map(({ type, label }) => {
                const kind = KINDS[type];
                const Icon = kind.icon;
                return (
                    <button
                        key={type}
                        type="button"
                        onClick={() => TRANSACTION_EDIT_HANDLE.openWithPayload({ type })}
                        className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-4 rounded-full bg-white type-body font-semibold text-[#11201E] cursor-pointer whitespace-nowrap"
                    >
                        <span className={cn("size-9 grid place-items-center rounded-full", kind.tile)}><Icon size={18} strokeWidth={2} /></span>
                        {label}
                    </button>
                )
            })}
        </div>
    )
}
