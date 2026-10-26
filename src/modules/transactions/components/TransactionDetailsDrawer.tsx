import { useSelector } from "react-redux";
import { Archive, Pencil, RotateCcw, Trash2, X } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/shared/components/ui/drawer";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import { transactionServices } from "../transaction.services";
import { TRANSACTION_DELETE_HANDLE, TRANSACTION_DRAWER_HANDLE, TRANSACTION_EDIT_HANDLE } from "../transactions.constants";
import { selectAccountNames, selectCategoryNames, selectSubCategoryNames, selectTransactions } from "../transactions.selectors";
import { parseLocalDate } from "../transactions.utils";
import { KINDS, formatAmount } from "./TransactionRow";

// phone: slides up from the bottom like a sheet. tablet and desktop: slides in from the right (same as the accounts panel)
export default function TransactionDetailsDrawer() {
    const isPhone = useMediaQuery("(max-width: 767px)");

    return (
        <Drawer handle={TRANSACTION_DRAWER_HANDLE} swipeDirection={isPhone ? "down" : "right"} showSwipeHandle={isPhone}>
            {({ payload }) => payload ? (
                <DrawerContent
                    className={cn("border-0! p-0 w-full", isPhone ? "rounded-t-[24px]!" : "rounded-none! max-w-110")}
                    overlayClassName="bg-ink-soft/50"
                >
                    <Details id={payload.id} />
                </DrawerContent>
            ) : null}
        </Drawer>
    )
}

function Details({ id }: { id: string }) {
    const transaction = useSelector(selectTransactions).find(t => t.id === id);
    const categoryNames = useSelector(selectCategoryNames);
    const subCategoryNames = useSelector(selectSubCategoryNames);
    const accountNames = useSelector(selectAccountNames);
    if (!transaction) return null;

    const kind = KINDS[transaction.type];
    const Icon = kind.icon;
    const isArchived = transaction.isArchived ?? false;

    const name = (names: Record<string, string>, itemId?: string) => (itemId ? names[itemId] ?? "" : "");
    const categoryName = name(categoryNames, transaction.categoryId);
    const category = transaction.subCategoryId ? `${categoryName} › ${name(subCategoryNames, transaction.subCategoryId)}` : categoryName;
    const isTwoAccounts = Boolean(transaction.fromAccountId && transaction.toAccountId);
    const account = isTwoAccounts
        ?`${name(accountNames, transaction.fromAccountId)} → ${name(accountNames, transaction.toAccountId)}`
        : name(accountNames, transaction.fromAccountId ?? transaction.toAccountId);
    // the transaction has only a date, the time is when it was created
    const date = parseLocalDate(transaction.transactionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const time = new Date(transaction.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();

    const rows = [
        { label: "Date & time", value: `${date} · ${time}` },
        { label: "Category", value: category },
        { label: isTwoAccounts ? "From → To" : "Account", value: account },
        { label: "Type", value: kind.label },
    ];

    return (
        <>
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
                <DrawerTitle className="text-[20px] leading-7 font-semibold text-[#11201E]">Transaction details</DrawerTitle>
                <DrawerClose render={<button aria-label="Close" className="size-10 -mr-2 -mt-1 grid place-items-center rounded-full text-[#11201E] cursor-pointer hover:bg-[#EEF3F1]"><X size={20} strokeWidth={1.8} /></button>} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 flex flex-col gap-4">
                <div className="rounded-3xl bg-[#F1F4F3] p-4">
                    <div className="flex items-center gap-3">
                        <span className={cn("size-12 shrink-0 grid place-items-center rounded-2xl", kind.tile)}><Icon size={22} strokeWidth={2} /></span>
                        <span className="min-w-0 flex flex-col items-start gap-1">
                            <span className="text-base font-semibold text-[#11201E] truncate max-w-full">{transaction.title ?? categoryName}</span>
                            <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-semibold", kind.tile)}>{kind.label}</span>
                        </span>
                    </div>
                    <p className={cn("mt-3 text-4xl font-bold tracking-tight break-all", kind.amount)}>{formatAmount(transaction)}</p>
                </div>

                <ul className="rounded-[20px] border border-[#E1E8E6] overflow-hidden">
                    {rows.map(row => (
                        <li key={row.label} className="flex justify-between gap-4 px-4 py-3.5 text-sm border-b border-[#EEF2F0] last:border-b-0">
                            <span className="text-[#5A6B68]">{row.label}</span>
                            <span className="font-semibold text-[#11201E] text-right">{row.value}</span>
                        </li>
                    ))}
                </ul>

                <section>
                    <h4 className="text-sm text-[#5A6B68] mb-2">Notes</h4>
                    {transaction.note
                        ? <p className="rounded-2xl bg-[#F1F4F3] px-4 py-3.5 text-sm text-[#11201E]">{transaction.note}</p>
                        : <p className="text-sm text-[#7B8A87]">No notes added.</p>}
                </section>
            </div>

            {/* Edit and Delete open their dialogs (the panel closes first), Archive/Restore switches the state and the panel stays open */}
            <div className="shrink-0 flex gap-3 px-5 pt-3 pb-5 max-md:border-t max-md:border-[#EEF2F0]">
                <button type="button" onClick={() => { TRANSACTION_DRAWER_HANDLE.close(); TRANSACTION_EDIT_HANDLE.openWithPayload({ id }); }} className="h-12 flex-1 flex items-center justify-center gap-2 rounded-full border border-[#CBD5D2] text-sm font-semibold text-[#11201E] cursor-pointer"><Pencil size={16} /> Edit</button>
                <button type="button" onClick={() => isArchived ? transactionServices.restoreTransaction(id) : transactionServices.archiveTransaction(id)} className="h-12 flex-1 flex items-center justify-center gap-2 rounded-full border border-[#CBD5D2] text-sm font-semibold text-[#11201E] cursor-pointer">
                    {isArchived ? <><RotateCcw size={16} /> Restore</> : <><Archive size={16} /> Archive</>}
                </button>
                <button type="button" onClick={() => { TRANSACTION_DRAWER_HANDLE.close(); TRANSACTION_DELETE_HANDLE.openWithPayload({ id }); }} className="h-12 flex-1 flex items-center justify-center gap-2 rounded-full bg-[#FFE4E4] text-sm font-semibold text-[#B42318] cursor-pointer"><Trash2 size={16} /> Delete</button>
            </div>
        </>
    )
}
