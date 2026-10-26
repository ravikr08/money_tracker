import { useState } from "react";
import { useSelector } from "react-redux";
import { CalendarDays, ChevronDown, Plus, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { formatCurrency } from "@/shared/utils/utils";
import { AccountsTypeNameMap } from "@/modules/accounts/accounts.constants";
import { selectSortedAccounts, selectSortedCreditCards } from "@/modules/accounts/accounts.selectors";
import { TRANSACTION_DELETE_HANDLE, TRANSACTION_EDIT_HANDLE } from "../transactions.constants";
import { selectTransactions } from "../transactions.selectors";
import { transactionServices } from "../transaction.services";
import { formatAmount } from "./TransactionRow";
import type { Transaction, TransactionTypes } from "../transaction.model";

// phone: a sheet from the bottom with a small handle. tablet and desktop: a box in the middle (same as the day popup of the calendar)
const SHEET = "gap-0 rounded-[28px] bg-white p-0 sm:max-w-[480px] max-h-[90dvh] overflow-hidden flex flex-col max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:translate-x-0 max-md:translate-y-0 max-md:max-w-full max-md:sm:max-w-full max-md:rounded-b-none";

function Handle() {
    return <span className="md:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-[#D5DDDA]"></span>
}

function SheetHeader({ title }: { title: string }) {
    return (
        <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
            <DialogTitle className="text-[20px] leading-7 font-semibold text-[#11201E]">{title}</DialogTitle>
            <DialogClose render={<button aria-label="Close" className="size-10 -mr-2 -mt-1 grid place-items-center rounded-full text-[#11201E] cursor-pointer hover:bg-[#EEF3F1]"><X size={20} strokeWidth={1.8} /></button>} />
        </div>
    )
}

// ---------- delete ----------

export function TransactionDeleteDialog() {
    return (
        <Dialog handle={TRANSACTION_DELETE_HANDLE}>
            {({ payload }) => payload ? <DeleteContent id={payload.id} /> : null}
        </Dialog>
    )
}

function DeleteContent({ id }: { id: string }) {
    const transaction = useSelector(selectTransactions).find(t => t.id === id);
    if (!transaction) return null;

    return (
        <DialogContent showCloseButton={false} className={SHEET}>
            <Handle />
            <SheetHeader title="Delete transaction?" />
            <div className="px-6 pb-5 flex flex-col gap-3">
                <span className="size-12 grid place-items-center rounded-full bg-[#FFE4E4] text-[#B42318]"><TrashIcon /></span>
                <DialogDescription className="text-sm text-[#5A6B68]">
                    “{transaction.title}” ({formatAmount(transaction)}) will be removed and its effect on your account balances will be reversed.
                </DialogDescription>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[#EEF2F0] md:justify-end">
                <DialogClose render={<button type="button" className="h-12 max-md:flex-1 md:px-6 rounded-full border border-[#CBD5D2] text-sm font-semibold text-[#11201E] cursor-pointer">Cancel</button>} />
                <button type="button" onClick={() => { transactionServices.deleteTransaction(id); TRANSACTION_DELETE_HANDLE.close(); }} className="h-12 max-md:flex-1 md:px-6 rounded-full bg-[#B42318] hover:bg-[#9A1D14] text-sm font-semibold text-white cursor-pointer">Delete</button>
            </div>
        </DialogContent>
    )
}

function TrashIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" /></svg>
}

// ---------- edit ----------

const TYPE_TABS: { value: TransactionTypes, label: string }[] = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
    { value: "transfer", label: "Transfer" },
    { value: "payment", label: "Card bill" },
];

const fieldClass = "w-full h-12 px-4 rounded-2xl border border-[#CBD5D2] bg-white text-sm text-[#11201E] outline-none focus:border-[#0E7C6B]";

// the form is filled with the transaction, "Save Changes" writes the draft back with transactionServices.updateTransaction
export function TransactionEditDialog() {
    return (
        <Dialog handle={TRANSACTION_EDIT_HANDLE}>
            {({ payload }) => payload ? <EditContent id={payload.id} /> : null}
        </Dialog>
    )
}

// no id = the "new transaction" form, the same form with empty fields
function EditContent({ id }: { id?: string }) {
    const transaction = useSelector(selectTransactions).find(t => t.id === id);
    if (id && !transaction) return null;
    return (
        <DialogContent showCloseButton={false} className={SHEET}>
            <Handle />
            <SheetHeader title={transaction ? "Edit Transaction" : "New Transaction"} />
            <EditForm transaction={transaction} />
        </DialogContent>
    )
}

// "yyyy-mm-ddThh:mm" in local time, the shape datetime-local wants
function toLocalInput(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// `label` is what the trigger shows. with `name` and `sub` the list shows two lines instead (account name and its kind)
type SelectItemData = { value: string, label: string, name?: string, sub?: string, disabled?: boolean };

const groupLabelClass = "px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider uppercase text-[#5A6B68]";
// the check mark of the shadcn item is hidden (it is the last span), the selected one is shown by its green background
const itemClass = "group/item min-h-11 px-3 rounded-xl text-sm font-medium text-[#11201E] cursor-pointer data-selected:bg-[#DDF3EE] data-selected:text-[#0A5F52] data-selected:font-semibold data-highlighted:bg-[#EEF3F1] data-disabled:opacity-50 [&>span:last-child]:hidden";

// a select made from the shadcn Select (Base UI) instead of the browser's own <select>, which can't be styled.
// `items` is what the trigger needs to turn a value into its label. without children the list is just the items
// on the phone the list opens above the select (there is no room under it in the sheet) and lines up with the left or right edge of it
function FormSelect({ label, value, onChange, items, children, align = "start" }: { label: string, value: string, onChange: (value: string) => void, items: SelectItemData[], children?: React.ReactNode, align?: "start" | "end" }) {
    const isPhone = useMediaQuery("(max-width: 767px)");
    return (
        <div className="flex flex-col gap-1.5 min-w-0">
            <span className="text-sm text-[#5A6B68]">{label}</span>
            <Select value={value} onValueChange={next => next !== null && onChange(next)} items={items}>
                <SelectTrigger aria-label={label} className="w-full h-12 px-4 gap-2 rounded-2xl border-[#CBD5D2] bg-white text-sm text-[#11201E] data-popup-open:border-[#0E7C6B] data-popup-open:ring-2 data-popup-open:ring-[#0E7C6B]/20">
                    <SelectValue className="truncate" />
                </SelectTrigger>
                {/* as wide as the longest item (not cut at the width of the trigger), but not wider than the screen, and it scrolls when it is long */}
                <SelectContent alignItemWithTrigger={false} side={isPhone ? "top" : "bottom"} align={align} sideOffset={6} className="w-max min-w-(--anchor-width) max-w-[calc(100vw-2rem)] max-h-72 rounded-2xl bg-white p-1.5 shadow-[0_12px_32px_rgba(17,32,30,0.18)] ring-1 ring-[#E1E8E6]">
                    {children ?? items.map(item => (
                        <SelectItem key={item.value} value={item.value} disabled={item.disabled} className={cn(itemClass, item.sub && "py-2")}>
                            {item.sub
                                ? <span className="flex flex-col gap-px"><span>{item.name}</span><span className="text-[11px] font-medium text-[#5A6B68] group-data-selected/item:text-[#0A5F52]">{item.sub}</span></span>
                                : item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

function EditForm({ transaction }: { transaction?: Transaction }) {
    const accounts = useSelector(selectSortedAccounts).filter(acc => acc.status !== "deleted");
    const cards = useSelector(selectSortedCreditCards).filter(card => card.status !== "deleted");
    const categories = useSelector((state: { categorySlice: { categories: { id: string, name: string, type: string, status: string }[] } }) => state.categorySlice.categories);
    const subcategoriesMap = useSelector((state: { categorySlice: { subcategoriesMap: Record<string, { id: string, name: string, status: string }[]> } }) => state.categorySlice.subcategoriesMap);

    // the draft lives here, the form starts as a copy of the transaction. the component is made new for every opening
    // a new transaction starts as an expense from the first account, with the first expense category
    const [type, setType] = useState<TransactionTypes>(transaction?.type ?? "expense");
    const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "");
    const [title, setTitle] = useState(transaction?.title ?? "");
    const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? categories.find(cat => cat.status === "active" && cat.type === "expense")?.id ?? "");
    const [subCategoryId, setSubCategoryId] = useState(() => {
        if (transaction) return transaction.subCategoryId ?? "";
        const firstExpense = categories.find(cat => cat.status === "active" && cat.type === "expense");
        return (firstExpense ? (subcategoriesMap[firstExpense.id] ?? []).find(sub => sub.status === "active")?.id : undefined) ?? "";
    });
    const [from, setFrom] = useState(transaction?.fromAccountId ?? accounts[0]?.id ?? "");
    const [to, setTo] = useState(transaction?.toAccountId ?? accounts[0]?.id ?? "");
    const [note, setNote] = useState(transaction?.note ?? "");
    // the note box is behind "Add note" until there is a note
    const [showNote, setShowNote] = useState(Boolean(transaction?.note));
    // the transaction has a date and the time it was created, datetime-local wants both in one "2026-10-24T09:05"
    const [when, setWhen] = useState(() => {
        if (!transaction) return toLocalInput(new Date());
        const created = new Date(transaction.createdAt);
        return `${transaction.transactionDate}T${toLocalInput(created).slice(11)}`;
    });

    // archived ones are listed but can't be picked
    const accountItems: SelectItemData[] = accounts.map(acc => ({
        value: acc.id,
        label: `${acc.name} · ${AccountsTypeNameMap[acc.type]}`,
        name: acc.name,
        sub: acc.status === "archived" ? "Archived account" : AccountsTypeNameMap[acc.type],
        disabled: acc.status === "archived",
    }));
    const cardItems: SelectItemData[] = cards.map(card => ({
        value: card.id,
        label: `${card.name} · Credit card`,
        name: card.name,
        sub: card.status === "archived" ? "Archived account" : `Credit card · ${formatCurrency(card.totalDueAmount)} due`,
        disabled: card.status === "archived",
    }));
    // the category types are the same four as the transaction types. transfer and card bill have one category each, no select for it
    const categoryOptions = categories.filter(cat => cat.status === "active" && cat.type === type);

    // a category of the old type is not valid for the new one, so the first one of the new type is picked
    function handleTypeChange(next: TransactionTypes) {
        setType(next);
        if (!categories.some(cat => cat.id === categoryId && cat.type === next)) {
            const [catId, subId] = firstCategory(next);
            setCategoryId(catId);
            setSubCategoryId(subId);
        }
    }

    // the first category of a type with its first subcategory, as "catId|subId" parts
    function firstCategory(forType: TransactionTypes) {
        const cat = categories.find(c => c.status === "active" && c.type === forType);
        const sub = cat ? (subcategoriesMap[cat.id] ?? []).find(s => s.status === "active") : undefined;
        return [cat?.id ?? "", sub?.id ?? ""];
    }

    // the category select holds both: "Food" is "catId|" and "Food › Grocery" is "catId|subId"
    function handleCategoryChange(value: string) {
        const [catId, subId] = value.split("|");
        setCategoryId(catId);
        setSubCategoryId(subId);
    }

    // "Today, 24 Oct 2026 · 9:05 am" for the date button
    const whenDate = new Date(when);
    const whenLabel = (() => {
        const today = toLocalInput(new Date()).slice(0, 10);
        const yesterday = toLocalInput(new Date(Date.now() - 86400000)).slice(0, 10);
        const day = when.slice(0, 10) === today ? "Today" : when.slice(0, 10) === yesterday ? "Yesterday" : whenDate.toLocaleDateString("en-GB", { weekday: "short" });
        const date = whenDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        const time = whenDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase();
        return `${day}, ${date} · ${time}`;
    })();

    function handleSave() {
        const value = parseFloat(amount);
        if (Number.isNaN(value) || value <= 0) return;
        // which accounts a type uses: expense takes from one, income puts into one, transfer and card bill have both
        const uses = { from: type === "expense" || type === "transfer" || type === "payment", to: type !== "expense" };
        const data = {
            type,
            amount: value,
            title: title.trim() || undefined,
            categoryId,
            subCategoryId: subCategoryId || undefined,
            fromAccountId: uses.from ? from || undefined : undefined,
            toAccountId: uses.to ? to || undefined : undefined,
            note: note.trim() || undefined,
            // "2026-10-24T09:05" -> the date, and the time goes into createdAt because that is where the time is kept
            transactionDate: when.slice(0, 10),
            createdAt: new Date(when).toISOString(),
        };
        if (transaction) transactionServices.updateTransaction(transaction.id, data);
        else transactionServices.addTransaction(data);
        TRANSACTION_EDIT_HANDLE.close();
    }

    // what the two selects under the title mean depends on the type
    // the second select of the row is the right one, so its list lines up with the right edge
    const accountSelect = (label: string, value: string, onChange: (v: string) => void, items: SelectItemData[], align: "start" | "end" = "end") => (
        <FormSelect label={label} value={value} onChange={onChange} items={items} align={align} />
    );

    // the trigger shows "Food › Grocery", the list shows the subcategories under a small "FOOD" title.
    // a category without subcategories is one item with its own name. the "catId|" items are only there so the trigger can name a transaction that has no subcategory
    const categoryItems: SelectItemData[] = categoryOptions.flatMap(cat => {
        const subs = (subcategoriesMap[cat.id] ?? []).filter(sub => sub.status === "active");
        return [{ value: `${cat.id}|`, label: cat.name }, ...subs.map(sub => ({ value: `${cat.id}|${sub.id}`, label: `${cat.name} › ${sub.name}` }))];
    });
    const categorySelect = (
        <FormSelect label="Category" value={`${categoryId}|${subCategoryId}`} onChange={handleCategoryChange} items={categoryItems}>
            {categoryOptions.map(cat => {
                const subs = (subcategoriesMap[cat.id] ?? []).filter(sub => sub.status === "active");
                return (
                    <SelectGroup key={cat.id}>
                        <SelectLabel className={groupLabelClass}>{cat.name}</SelectLabel>
                        {subs.length > 0
                            ? subs.map(sub => <SelectItem key={sub.id} value={`${cat.id}|${sub.id}`} className={itemClass}>{sub.name}</SelectItem>)
                            : <SelectItem value={`${cat.id}|`} className={itemClass}>{cat.name}</SelectItem>}
                    </SelectGroup>
                )
            })}
        </FormSelect>
    );

    return (
        <>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-5 flex flex-col gap-3">
                <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-[#EEF3F1]">
                    {TYPE_TABS.map(tab => (
                        <button key={tab.value} type="button" onClick={() => handleTypeChange(tab.value)} className={cn("h-10 rounded-xl text-[13px] font-semibold cursor-pointer", type === tab.value ? "bg-[#0B1F1C] text-white" : "text-[#5A6B68]")}>{tab.label}</button>
                    ))}
                </div>

                <label className="flex items-center justify-center gap-2 h-16 rounded-2xl bg-[#F1F4F3]">
                    <span className="text-2xl font-semibold text-[#5A6B68]">₹</span>
                    <input type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" aria-label="Amount" className="w-40 border-0 outline-0 bg-transparent text-3xl font-bold text-[#11201E] placeholder:text-[#7B8A87]" />
                </label>

                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title, e.g. Dinner with friends" aria-label="Title" className={fieldClass} />

                <div className="grid grid-cols-2 gap-3">
                    {type === "expense" && <>
                        {categorySelect}
                        {accountSelect("Paid from", from, setFrom, [...accountItems, ...cardItems])}
                    </>}
                    {type === "income" && <>
                        {categorySelect}
                        {accountSelect("Deposit to", to, setTo, accountItems)}
                    </>}
                    {type === "transfer" && <>
                        {accountSelect("From", from, setFrom, accountItems, "start")}
                        {accountSelect("To", to, setTo, accountItems)}
                    </>}
                    {type === "payment" && <>
                        {accountSelect("Pay from", from, setFrom, accountItems, "start")}
                        {accountSelect("Credit card", to, setTo, cardItems)}
                    </>}
                </div>

                {/* the button is only the look, the real input lies over it with no colour and opens the browser's picker when clicked */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm text-[#5A6B68]">Date &amp; time</span>
                    <div className="relative">
                        <div className={cn(fieldClass, "flex items-center gap-2.5")}>
                            <CalendarDays size={18} className="shrink-0 text-[#0E7C6B]" />
                            <span className="flex-1 truncate">{whenLabel}</span>
                            <ChevronDown size={16} className="shrink-0 opacity-70" />
                        </div>
                        <input type="datetime-local" value={when} onChange={e => e.target.value && setWhen(e.target.value)} onClick={e => e.currentTarget.showPicker?.()} aria-label="Date and time" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                </div>

                {showNote
                    ? <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note" aria-label="Note" autoFocus className={fieldClass} />
                    : <button type="button" onClick={() => setShowNote(true)} className="self-start flex items-center gap-2 py-1 text-sm font-semibold text-[#0E7C6B] cursor-pointer"><Plus size={16} /> Add note</button>}
            </div>

            <div className="shrink-0 flex gap-3 px-6 py-4 border-t border-[#EEF2F0]">
                <DialogClose render={<button type="button" className="h-12 flex-1 rounded-full border border-[#CBD5D2] text-sm font-semibold text-[#11201E] cursor-pointer">Cancel</button>} />
                <button type="button" onClick={handleSave} className="h-12 flex-[1.4] rounded-full bg-[#0E7C6B] hover:bg-[#0A6B5C] text-sm font-semibold text-white cursor-pointer">{transaction ? "Save Changes" : "Save Transaction"}</button>
            </div>
        </>
    )
}
