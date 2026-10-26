import { Archive, Ellipsis, Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { transactionServices } from "../transaction.services";
import { TRANSACTION_DELETE_HANDLE, TRANSACTION_DRAWER_HANDLE, TRANSACTION_EDIT_HANDLE } from "../transactions.constants";
import { useTransactionRow } from "../useTransactionRow";
import type { Transaction } from "../transaction.model";
import TransactionCompactRow from "./TransactionCompactRow";

// KINDS and formatAmount moved to their own file, they are exported from here too so the files that import them from the row keep working
export { KINDS, formatAmount } from "./transactionKinds";

// same columns as the header of the table (desktop has the date column too, it is hidden below xl)
export const ROW_COLUMNS = "grid grid-cols-[44px_minmax(0,1fr)_150px_112px_108px_40px] xl:grid-cols-[44px_minmax(200px,1.6fr)_210px_140px_88px_130px_40px] items-center gap-3 xl:gap-4";

const menuItemClass = "min-h-11 flex items-center gap-3 px-3 py-1.5 rounded-[10px] type-body font-medium text-[#11201E] cursor-pointer";

export default function TransactionRow({ transaction }: { transaction: Transaction }) {
    // the names, the date and the amount are built in one place (useTransactionRow), the dashboard uses it too
    const row = useTransactionRow(transaction);
    const { kind, isArchived } = row;
    const Icon = kind.icon;
    const toggleArchive = () => isArchived ? transactionServices.restoreTransaction(transaction.id) : transactionServices.archiveTransaction(transaction.id);
    const openDetails =() => TRANSACTION_DRAWER_HANDLE.openWithPayload({ id: transaction.id });

    return (
        <>
            {/* phone: a card row with the amount and the time on the right */}
            <TransactionCompactRow transaction={transaction} className="md:hidden min-h-16 px-3.5 py-2.5 bg-white" />

            {/* tablet and desktop: the columns of the table */}
            <div onClick={openDetails} className={`hidden md:grid ${ROW_COLUMNS} min-h-[68px] py-2.5 pr-3 pl-5 border-t border-[#EEF2F0] hover:bg-[#F7FAF9] cursor-pointer ${isArchived ? "opacity-60" : ""}`}>
                <span className={`size-10 grid place-items-center rounded-xl ${kind.tile}`}><Icon size={19} strokeWidth={2} /></span>

                <span className="min-w-0 flex flex-col gap-0.5">
                    <span className="type-item-title font-semibold truncate">{row.title}</span>
                    <span className="type-caption text-[#5A6B68]">{kind.label}{isArchived && " · Archived"}</span>
                    {row.note && <span className="type-caption italic text-[#7B8A87] truncate">“{row.note}”</span>}
                </span>

                <span className="justify-self-start max-w-full px-3 py-1 rounded-full bg-[#EEF3F1] text-[#3C4C49] type-caption font-semibold whitespace-nowrap truncate">{row.category}</span>
                <span className="type-body text-[#5A6B68] xl:text-[#3C4C49] truncate">{row.account}</span>
                <span className="hidden xl:block type-body text-[#5A6B68] truncate">{row.date}</span>
                <b className={`text-right type-item-title font-bold ${kind.amount}`}>{row.amount}</b>

                {/* only "View details" works, the other three are for you to wire */}
                {/* the row opens the details when clicked, so clicks on the menu are stopped here (they would bubble through the portal too) */}
                <DropdownMenu>
                    <DropdownMenuTrigger onClick={e => e.stopPropagation()} aria-label={"More options for " + row.title} className="size-10 grid place-items-center rounded-full text-[#5A6B68] cursor-pointer hover:bg-[#EEF3F1] data-popup-open:border-2 data-popup-open:border-[#0E7C6B] outline-none">
                        <Ellipsis size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={6} onClick={e => e.stopPropagation()} className="min-w-[200px] p-1.5 rounded-2xl bg-white border border-[#E1E8E6] shadow-[0_12px_32px_rgba(17,32,30,0.18)] ring-0">
                        <DropdownMenuItem onClick={openDetails} className={menuItemClass}><Eye size={16} /> View details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => TRANSACTION_EDIT_HANDLE.openWithPayload({ id: transaction.id })} className={menuItemClass}><Pencil size={16} /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={toggleArchive} className={menuItemClass}>{isArchived ? <><RotateCcw size={16} /> Restore</> : <><Archive size={16} /> Archive</>}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => TRANSACTION_DELETE_HANDLE.openWithPayload({ id: transaction.id })} className={cn(menuItemClass, "text-[#B42318]")}><Trash2 size={16} /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    )
}
