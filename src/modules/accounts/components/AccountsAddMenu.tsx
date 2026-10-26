import { useState } from "react";
import { CreditCard, Plus, Wallet, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { ACCOUNTS_DIALOG_HANLDE } from "../accounts.constants";

const itemClass = "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl w-full type-body font-semibold text-[#1B2240] hover:bg-blue-soft";
const iconClass = "size-9 grid place-items-center rounded-lg bg-[#E8ECFF] text-[#3347E0]";

// phone only: the + button floats above the bottom menu and opens a small menu to pick what to add
export default function AccountsAddMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="contents md:hidden">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                    aria-label="Add account or credit card"
                    className="fixed right-4 bottom-[92px] z-30 size-12 grid place-items-center rounded-full bg-[#3347E0] text-white shadow-[0_8px_20px_rgba(51,71,224,0.35)] cursor-pointer"
                >
                    {open ? <X size={22} strokeWidth={2.2} /> : <Plus size={22} strokeWidth={2.2} />}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" sideOffset={12} className="w-auto min-w-[220px] p-2 bg-white rounded-2xl shadow-[0_8px_24px_rgba(20,30,80,0.18)] ring-0">
                    <DropdownMenuItem className="p-0" onClick={() => ACCOUNTS_DIALOG_HANLDE.openWithPayload({ mode: "create", type: "account" })}>
                        <span className={itemClass}><span className={iconClass}><Wallet size={18} /></span> New Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0" onClick={() => ACCOUNTS_DIALOG_HANLDE.openWithPayload({ mode: "create", type: "credit-card" })}>
                        <span className={itemClass}><span className={iconClass}><CreditCard size={18} /></span> New Credit Card</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
