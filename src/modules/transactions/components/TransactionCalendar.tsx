import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { selectAccountNames, selectCategoryNames, selectFilteredTransactions, selectSubCategoryNames } from "../transactions.selectors";
import { formatSigned, groupTransactions, parseLocalDate, summarizeTransactions } from "../transactions.utils";
import type { Transaction, TransactionTypes } from "../transaction.model";
import { KINDS, formatAmount } from "./TransactionRow";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// the colour of the dot of each kind of transaction, as in the legend of the design
const DOTS: Record<TransactionTypes, string> = {
    income: "bg-[#1FA97A]",
    expense: "bg-[#E0773D]",
    transfer: "bg-[#6B6FE0]",
    payment: "bg-[#6B6FE0]",
}

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

// 1300 -> "1.3k", 71514 -> "71.5k", small amounts stay as they are. the cells are too small for the full amount
function shortAmount(n: number) {
    const abs = Math.abs(n);
    const text = abs >= 1000 ? `${parseFloat((abs / 1000).toFixed(1))}k` : String(Math.round(abs));
    return (n > 0 ? "+" : "−") + "₹" + text;
}

// the month grid. the transactions are the ones the toolbar filters give, so the calendar follows the filters too
export default function TransactionCalendar() {
    const transactions = useSelector(selectFilteredTransactions);
    const [shown, setShown] = useState(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });
    // the day whose popup is open, "2026-10-24". null = closed
    const [openDay, setOpenDay] = useState<string | null>(null);

    const now = new Date();
    const todayKey = dayKey(now.getFullYear(), now.getMonth(), now.getDate());
    const isCurrentMonth = shown.year === now.getFullYear() && shown.month === now.getMonth();

    // day key -> its transactions
    const byDay = new Map<string, Transaction[]>();
    for (const t of transactions) {
        const d = parseLocalDate(t.transactionDate);
        const key = dayKey(d.getFullYear(), d.getMonth(), d.getDate());
        byDay.set(key, [...(byDay.get(key) ?? []), t]);
    }

    const daysInMonth = new Date(shown.year, shown.month + 1, 0).getDate();
    const firstWeekday = new Date(shown.year, shown.month, 1).getDay(); // 0 = Sunday
    const monthLabel = new Date(shown.year, shown.month, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

    function moveMonth(step: number) {
        const next = new Date(shown.year, shown.month + step, 1);
        setShown({ year: next.getFullYear(), month: next.getMonth() });
    }

    // empty cells before the 1st, then the days
    const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

    return (
        <section className="rounded-3xl bg-white p-3 md:p-6">
            <div className="grid grid-cols-[44px_1fr_44px] items-center mb-3 md:mb-4">
                <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" className="size-11 grid place-items-center rounded-full bg-[#EEF3F1] text-[#11201E] cursor-pointer">
                    <ChevronLeft size={18} />
                </button>
                <MonthPicker label={monthLabel} shown={shown} onPick={(year, month) => setShown({ year, month })} />
                <button type="button" onClick={() => moveMonth(1)} disabled={isCurrentMonth} aria-label="Next month" className="size-11 grid place-items-center rounded-full bg-[#EEF3F1] text-[#11201E] cursor-pointer disabled:opacity-40 disabled:cursor-default">
                    <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-7">
                {/* phone: one letter, tablet and desktop: three */}
                {WEEKDAYS.map(day => <span key={day} className="py-2 text-center text-xs font-semibold text-[#5A6B68]"><span className="md:hidden">{day[0]}</span><span className="hidden md:inline">{day}</span></span>)}

                {cells.map((day, i) => {
                    if (day === null) return <span key={"empty-" + i}></span>;
                    const key = dayKey(shown.year, shown.month, day);
                    const list = byDay.get(key) ?? [];
                    const net = summarizeTransactions(list).net;
                    const kinds = [...new Set(list.map(t => DOTS[t.type]))];
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setOpenDay(key)}
                            className={cn(
                                "min-h-[56px] md:min-h-[104px] m-0.5 md:m-1 p-1 pt-2 md:p-3 rounded-[12px] md:rounded-[16px] border border-transparent outline-none focus-visible:ring-2 focus-visible:ring-[#0E7C6B]/50 flex flex-col items-center md:items-start justify-start gap-1 text-left",
                                "cursor-pointer hover:bg-[#F7FAF9]",
                                key === todayKey && "bg-[#DDF3EE] border-[#0E7C6B] hover:bg-[#DDF3EE]",
                            )}
                        >
                            <span className="text-[15px] md:text-sm font-semibold text-[#11201E]">{day}</span>
                            {list.length > 0 && <>
                                {/* the amount is only on tablet and desktop, the phone cells have no room for it */}
                                <span className={cn("hidden md:block text-xs font-semibold", net > 0 ? "text-[#0B7A4B]" : "text-[#5A6B68]")}>{shortAmount(net)}</span>
                                <span className="flex gap-1">{kinds.map(color => <span key={color} className={cn("size-1.5 rounded-full", color)}></span>)}</span>
                            </>}
                        </button>
                    )
                })}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-xs text-[#5A6B68]">
                <span className="flex items-center gap-1.5"><span className={cn("size-1.5 rounded-full", DOTS.income)}></span>Income</span>
                <span className="flex items-center gap-1.5"><span className={cn("size-1.5 rounded-full", DOTS.expense)}></span>Expense</span>
                <span className="flex items-center gap-1.5"><span className={cn("size-1.5 rounded-full", DOTS.transfer)}></span>Transfer / card payment</span>
            </div>

            <DayPopup dayKey={openDay} transactions={openDay ? byDay.get(openDay) ?? [] : []} onClose={() => setOpenDay(null)} />
        </section>
    )
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// the month label is a button that opens a small box: arrows for the year and the twelve months.
// months after the current one can't be picked (there is nothing to show there yet)
function MonthPicker({ label, shown, onPick }: { label: string, shown: { year: number, month: number }, onPick: (year: number, month: number) => void }) {
    // the year of the box. it is its own state so the arrows don't change the calendar until a month is picked
    const [year, setYear] = useState(shown.year);
    const now = new Date();

    return (
        <Popover.Root onOpenChange={open => { if (open) setYear(shown.year); }}>
            <Popover.Trigger className="justify-self-center h-11 flex items-center gap-1.5 px-4 rounded-full border-2 border-transparent data-popup-open:border-[#0E7C6B] text-base md:text-lg font-semibold text-[#11201E] cursor-pointer outline-none">
                {label}
                <ChevronDown size={16} className="opacity-70" />
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Positioner sideOffset={8} className="z-50">
                    <Popover.Popup className="w-[300px] p-4 flex flex-col gap-3 rounded-3xl bg-white border border-[#E1E8E6] shadow-[0_12px_32px_rgba(17,32,30,0.18)] outline-none">
                        <div className="grid grid-cols-[40px_1fr_40px] items-center">
                            <button type="button" onClick={() => setYear(y => y - 1)} aria-label="Previous year" className="size-10 grid place-items-center rounded-full bg-[#EEF3F1] cursor-pointer"><ChevronLeft size={16} /></button>
                            <b className="text-center text-[15px] text-[#11201E]">{year}</b>
                            <button type="button" onClick={() => setYear(y => y + 1)} disabled={year >= now.getFullYear()} aria-label="Next year" className="size-10 grid place-items-center rounded-full bg-[#EEF3F1] cursor-pointer disabled:opacity-40 disabled:cursor-default"><ChevronRight size={16} /></button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {MONTHS.map((name, i) => {
                                const isFuture = year > now.getFullYear() || (year === now.getFullYear() && i > now.getMonth());
                                const isShown = year === shown.year && i === shown.month;
                                return (
                                    <Popover.Close
                                        key={name}
                                        disabled={isFuture}
                                        onClick={() => onPick(year, i)}
                                        className={cn("h-11 rounded-xl text-sm font-semibold cursor-pointer disabled:cursor-default", isShown ? "bg-[#0B1F1C] text-white" : "bg-[#EEF3F1] text-[#11201E]", isFuture && "opacity-40")}
                                    >
                                        {name}
                                    </Popover.Close>
                                )
                            })}
                        </div>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
}

// the popup with the transactions of one day. `dayKey` null = closed
function DayPopup({ dayKey, transactions, onClose }: { dayKey: string | null, transactions: Transaction[], onClose: () => void }) {
    const categoryNames = useSelector(selectCategoryNames);
    const subCategoryNames = useSelector(selectSubCategoryNames);
    const accountNames = useSelector(selectAccountNames);

    // the title is the label of the daily list ("Today · 24 Oct"). a day without transactions has no group, so its label is made here
    const group = transactions.length > 0 ? groupTransactions(transactions, "daily")[0] : null;
    const emptyLabel = dayKey ? (() => {
        const d = parseLocalDate(dayKey);
        return `${d.toLocaleDateString("en-GB", { weekday: "short" })} · ${d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
    })() : "";
    const count = group?.count ?? 0;

    const name = (names: Record<string, string>, id?: string) => (id ? names[id] ?? "" : "");

    // phone: a sheet from the bottom with a small handle. tablet and desktop: a box in the middle
    return (
        <Dialog open={dayKey !== null} onOpenChange={open => { if (!open) onClose(); }}>
            <DialogContent showCloseButton className="sm:max-w-[520px] gap-3 rounded-[28px] bg-white p-6 max-h-[80dvh] overflow-y-auto max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:translate-x-0 max-md:translate-y-0 max-md:max-w-full max-md:sm:max-w-full max-md:rounded-b-none max-md:pb-10">
                <span className="md:hidden mx-auto -mt-2 mb-1 h-1 w-10 rounded-full bg-[#D5DDDA]"></span>
                <DialogTitle className="text-xl font-semibold text-[#11201E]">{group?.label ?? emptyLabel}</DialogTitle>
                <DialogDescription className="text-sm text-[#5A6B68]">
                    {count} {count === 1 ? "transaction" : "transactions"}{group && ` · Net ${formatSigned(group.net)}`}
                </DialogDescription>

                {!group && <p className="mt-2 py-5 rounded-2xl bg-[#F1F4F3] text-center text-sm text-[#5A6B68]">No transactions on this day.</p>}

                <ul className="flex flex-col mt-2">
                    {group?.rows.map(t => {
                        const kind = KINDS[t.type];
                        const Icon = kind.icon;
                        const categoryName = name(categoryNames, t.categoryId);
                        const category = t.subCategoryId ? `${categoryName} › ${name(subCategoryNames, t.subCategoryId)}` : categoryName;
                        const account = name(accountNames, t.fromAccountId ?? t.toAccountId);
                        // the time of creation, the transaction has only a date
                        const time = new Date(t.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
                        return (
                            <li key={t.id} className="flex items-center gap-3 py-3 border-b border-[#EEF2F0] last:border-b-0">
                                <span className={cn("size-10 shrink-0 grid place-items-center rounded-xl", kind.tile)}><Icon size={19} strokeWidth={2} /></span>
                                <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                                    <span className="text-[15px] font-semibold truncate">{t.title ?? categoryName}</span>
                                    <span className="text-xs text-[#5A6B68] truncate">{category} · {account}</span>
                                    {t.note && <span className="text-xs italic text-[#7B8A87] truncate">“{t.note}”</span>}
                                </span>
                                <span className="shrink-0 flex flex-col items-end gap-0.5">
                                    <b className={cn("text-[15px] font-bold", kind.amount)}>{formatAmount(t)}</b>
                                    <span className="text-[11px] text-[#5A6B68]">{time}</span>
                                </span>
                            </li>
                        )
                    })}
                </ul>
            </DialogContent>
        </Dialog>
    )
}
