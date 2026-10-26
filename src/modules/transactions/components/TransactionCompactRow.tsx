import { cn } from "@/shared/lib/utils";
import { TRANSACTION_DRAWER_HANDLE } from "../transactions.constants";
import { useTransactionRow } from "../useTransactionRow";
import type { Transaction } from "../transaction.model";

// the one-line row with the amount and the date on the right. a click opens the details of the transaction.
// the transactions page uses it on the phone, the dashboard uses it for the recent transactions.
// `className` is for where it is: a card on the transactions page, a line of a list on the dashboard
export default function TransactionCompactRow({ transaction, className }: { transaction: Transaction; className?: string }) {
    const row = useTransactionRow(transaction);
    const Icon = row.kind.icon;

    return (
        <button type="button" onClick={() => TRANSACTION_DRAWER_HANDLE.openWithPayload({ id: transaction.id })} className={cn("w-full text-left flex items-center gap-3 cursor-pointer", row.isArchived && "opacity-60", className)}>
            <span className={`size-10 shrink-0 grid place-items-center rounded-xl ${row.kind.tile}`}><Icon size={19} strokeWidth={2} /></span>
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="type-item-title font-semibold truncate">{row.title}</span>
                <span className="type-caption text-[#5A6B68] truncate">{row.category} · {row.account}</span>
                {row.note && <span className="type-caption italic text-[#7B8A87] truncate">“{row.note}”</span>}
            </span>
            <span className="shrink-0 flex flex-col items-end gap-0.5">
                <b className={`type-item-title font-bold ${row.kind.amount}`}>{row.amount}</b>
                <span className="type-micro text-[#5A6B68]">{row.date}</span>
            </span>
        </button>
    )
}
