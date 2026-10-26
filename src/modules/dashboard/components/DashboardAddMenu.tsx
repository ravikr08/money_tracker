import { useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { KINDS } from "@/modules/transactions/components/TransactionRow";
import { TRANSACTION_EDIT_HANDLE } from "@/modules/transactions/transactions.constants";
import type { TransactionTypes } from "@/modules/transactions/transaction.model";

const ACTIONS: { type: TransactionTypes; label: string }[] = [
    { type: "income", label: "Add Income" },
    { type: "expense", label: "Add Expense" },
    { type: "transfer", label: "Transfer Money" },
];

// phone only: the round + button floats above the bottom menu and opens the same three actions as the buttons of the tablet and the desktop.
// the page behind it is dimmed while the menu is open, but not the bottom menu
export default function DashboardAddMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="contents md:hidden">
            {open && <div aria-hidden className="fixed inset-x-0 top-0 bottom-[73px] z-20 bg-[#0B1F1C]/25 backdrop-blur-[2px]" />}
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                    aria-label="Add a transaction"
                    className="fixed right-4 bottom-[92px] z-30 size-12 grid place-items-center rounded-full bg-[#0E7C6B] text-white shadow-[0_6px_16px_rgba(14,124,107,0.35)] cursor-pointer"
                >
                    {open ? <X size={22} strokeWidth={2.2} /> : <Plus size={22} strokeWidth={2.2} />}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" sideOffset={12} className="w-auto min-w-[220px] p-2 bg-white rounded-2xl shadow-[0_8px_24px_rgba(20,30,80,0.18)] ring-0">
                    {ACTIONS.map(({ type, label }) => {
                        const kind = KINDS[type];
                        const Icon = kind.icon;
                        return (
                            <DropdownMenuItem key={type} className="p-0" onClick={() => TRANSACTION_EDIT_HANDLE.openWithPayload({ type })}>
                                <span className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl w-full type-body font-semibold text-[#11201E] hover:bg-[#F2F5F4]">
                                    <span className={cn("size-9 grid place-items-center rounded-lg", kind.tile)}><Icon size={18} strokeWidth={2} /></span>
                                    {label}
                                </span>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
