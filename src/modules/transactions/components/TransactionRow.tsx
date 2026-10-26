import { Archive, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, CreditCard, Ellipsis, Eye, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { transactionServices } from "../transaction.services";
import { TRANSACTION_DELETE_HANDLE, TRANSACTION_DRAWER_HANDLE, TRANSACTION_EDIT_HANDLE } from "../transactions.constants";
import type { LucideIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { formatCurrency } from "@/shared/utils/utils";
import type { Transaction, TransactionTypes } from "../transaction.model";
import { selectAccountNames, selectCategoryNames, selectSubCategoryNames } from "../transactions.selectors";
import { parseLocalDate } from "../transactions.utils";

// same columns as the header of the table (desktop has the date column too, it is hidden below xl)
export const ROW_COLUMNS = "grid grid-cols-[44px_minmax(0,1fr)_150px_112px_108px_40px] xl:grid-cols-[44px_minmax(200px,1.6fr)_210px_140px_88px_130px_40px] items-center gap-3 xl:gap-4";

// look of each kind: label, icon, colours of the tile and colour of the amount
export const KINDS: Record<TransactionTypes, { label: string, icon: LucideIcon, tile: string, amount: string }> = {
    income: { label: "Income", icon: ArrowDownLeft, tile: "bg-[#DDF3EE] text-[#0A5F52]", amount: "text-[#0B7A4B]" },
    expense: { label: "Expense", icon: ArrowUpRight, tile: "bg-[#FFEFE6] text-[#B4531A]", amount: "text-[#11201E]" },
    transfer: { label: "Transfer", icon: ArrowLeftRight, tile: "bg-[#E6EAFF] text-[#2A3BC4]", amount: "text-[#5A6B68]" },
    payment: { label: "Card payment", icon: CreditCard, tile: "bg-[#EFE8FF] text-[#5B3FC4]", amount: "text-[#5B3FC4]" },
}

const menuItemClass = "min-h-11 flex items-center gap-3 px-3 py-1.5 rounded-[10px] type-body font-medium text-[#11201E] cursor-pointer";

// income and expense get a sign, transfers and card payments only move money so they have none
export function formatAmount(t: Transaction) {
    if (t.type === "income") return "+" + formatCurrency(t.amount);
    if (t.type === "expense") return "−" + formatCurrency(t.amount);
    return formatCurrency(t.amount);
}

export default function TransactionRow({ transaction }: { transaction: Transaction }) {
    const categoryNames = useSelector(selectCategoryNames);
    const subCategoryNames = useSelector(selectSubCategoryNames);
    const accountNames = useSelector(selectAccountNames);

    const kind = KINDS[transaction.type];
    const Icon = kind.icon;
    const isArchived = transaction.isArchived ?? false;
    const toggleArchive = () => isArchived ? transactionServices.restoreTransaction(transaction.id) : transactionServices.archiveTransaction(transaction.id);
    const openDetails =() => TRANSACTION_DRAWER_HANDLE.openWithPayload({ id: transaction.id });

    // the ids are stored, the names are looked up. deleted accounts and categories are only marked as deleted,
    // so they keep their name here. the fallback is only for the moment before the accounts are loaded from the db
    const name = (names: Record<string, string>, id?: string) => (id ? names[id] ?? "" : "");
    const categoryName = name(categoryNames, transaction.categoryId);
    const category = transaction.subCategoryId ? `${categoryName} › ${name(subCategoryNames, transaction.subCategoryId)}` : categoryName;
    const account = transaction.fromAccountId && transaction.toAccountId
        ? `${name(accountNames, transaction.fromAccountId)} → ${name(accountNames, transaction.toAccountId)}`
        : name(accountNames, transaction.fromAccountId ?? transaction.toAccountId);
    const date = parseLocalDate(transaction.transactionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

    // keeps the names the markup below was written with
    const row = { title: transaction.title ?? categoryName, note: transaction.note, category, account, date, amount: formatAmount(transaction) };

    return (
        <>
            {/* phone: a card row with the amount and the time on the right */}
            <button type="button" onClick={openDetails} className={cn("md:hidden w-full text-left flex items-center gap-3 min-h-16 px-3.5 py-2.5 bg-white cursor-pointer", isArchived && "opacity-60")}>
                <span className={`size-10 shrink-0 grid place-items-center rounded-xl ${kind.tile}`}><Icon size={19} strokeWidth={2} /></span>
                <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="type-item-title font-semibold truncate">{row.title}</span>
                    <span className="type-caption text-[#5A6B68] truncate">{row.category} · {row.account}</span>
                    {row.note && <span className="type-caption italic text-[#7B8A87] truncate">“{row.note}”</span>}
                </span>
                <span className="shrink-0 flex flex-col items-end gap-0.5">
                    <b className={`type-item-title font-bold ${kind.amount}`}>{row.amount}</b>
                    <span className="type-micro text-[#5A6B68]">{row.date}</span>
                </span>
            </button>

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
