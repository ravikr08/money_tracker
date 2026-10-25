import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, CreditCard, Ellipsis } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PlaceholderKind, PlaceholderRow } from "../transactions.placeholder";

// same columns as the header of the table (desktop has the date column too, it is hidden below xl)
export const ROW_COLUMNS = "grid grid-cols-[44px_minmax(0,1fr)_150px_112px_108px_40px] xl:grid-cols-[44px_minmax(200px,1.6fr)_210px_140px_88px_130px_40px] items-center gap-3 xl:gap-4";

// look of each kind: label, icon, colours of the tile and colour of the amount
const KINDS: Record<PlaceholderKind, { label: string, icon: LucideIcon, tile: string, amount: string }> = {
    income: { label: "Income", icon: ArrowDownLeft, tile: "bg-[#DDF3EE] text-[#0A5F52]", amount: "text-[#0B7A4B]" },
    expense: { label: "Expense", icon: ArrowUpRight, tile: "bg-[#FFEFE6] text-[#B4531A]", amount: "text-[#11201E]" },
    transfer: { label: "Transfer", icon: ArrowLeftRight, tile: "bg-[#E6EAFF] text-[#2A3BC4]", amount: "text-[#5A6B68]" },
    card: { label: "Card payment", icon: CreditCard, tile: "bg-[#EFE8FF] text-[#5B3FC4]", amount: "text-[#5B3FC4]" },
}

export default function TransactionRow({ row }: { row: PlaceholderRow }) {
    const kind = KINDS[row.kind];
    const Icon = kind.icon;

    return (
        <>
            {/* phone: a card row with the amount and the time on the right */}
            <div className="md:hidden flex items-center gap-3 min-h-16 px-3.5 py-2.5 bg-white">
                <span className={`size-10 shrink-0 grid place-items-center rounded-xl ${kind.tile}`}><Icon size={19} strokeWidth={2} /></span>
                <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold truncate">{row.title}</span>
                    <span className="text-xs text-[#5A6B68] truncate">{row.category} · {row.account}</span>
                    {row.note && <span className="text-xs italic text-[#7B8A87] truncate">“{row.note}”</span>}
                </span>
                <span className="shrink-0 flex flex-col items-end gap-0.5">
                    <b className={`text-[15px] font-bold ${kind.amount}`}>{row.amount}</b>
                    <span className="text-[11px] text-[#5A6B68]">{row.time}</span>
                </span>
            </div>

            {/* tablet and desktop: the columns of the table */}
            <div className={`hidden md:grid ${ROW_COLUMNS} min-h-[68px] py-2.5 pr-3 pl-5 border-t border-[#EEF2F0] hover:bg-[#F7FAF9]`}>
                <span className={`size-10 grid place-items-center rounded-xl ${kind.tile}`}><Icon size={19} strokeWidth={2} /></span>

                <span className="min-w-0 flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold truncate">{row.title}</span>
                    <span className="text-xs text-[#5A6B68]">{kind.label} · {row.time}</span>
                    {row.note && <span className="text-xs italic text-[#7B8A87] truncate">“{row.note}”</span>}
                </span>

                <span className="justify-self-start max-w-full px-3 py-1 rounded-full bg-[#EEF3F1] text-[#3C4C49] text-xs font-semibold whitespace-nowrap truncate">{row.category}</span>
                <span className="text-[13px] xl:text-sm text-[#5A6B68] xl:text-[#3C4C49] truncate">{row.account}</span>
                <span className="hidden xl:block text-sm text-[#5A6B68] truncate">{row.date}</span>
                <b className={`text-right text-[15px] font-bold ${kind.amount}`}>{row.amount}</b>

                <button type="button" aria-label={"More options for " + row.title} className="size-10 grid place-items-center rounded-full text-[#5A6B68] cursor-pointer hover:bg-[#EEF3F1]">
                    <Ellipsis size={18} />
                </button>
            </div>
        </>
    )
}
