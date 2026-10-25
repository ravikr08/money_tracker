import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Archive, ArrowLeftRight, CreditCard, PencilLine, RotateCcw, X } from "lucide-react";
import type { RootState } from "@/app/app.store";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/shared/components/ui/drawer"
import { DialogTrigger } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { ACCOUNTS_DIALOG_HANLDE, ACCOUNTS_DRAWER_HANDLE, AccountsTypeIconMap, AccountsTypeNameMap } from "../accounts.constants"
import { selectAccountBalance, selectCreditCardOutstanding } from "../accounts.selectors"
import { accountsServices } from "../accounts.services"
import { getDueInfo } from "../accounts.utils"
import type { AccountsDrawerPayload, AccountsKind } from "../accounts.model"
import { formatCurrency, getColorShades } from "@/shared/utils/utils"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"

// phone: slides up from the bottom like a sheet. tablet and desktop: slides in from the right
export default function AccountsDrawer() {
    const isPhone = useMediaQuery("(max-width: 767px)");

    return (
        <Drawer handle={ACCOUNTS_DRAWER_HANDLE} swipeDirection={isPhone ? "down" : "right"} showSwipeHandle={isPhone}>
            {({ payload }) => payload ? <AccountsDrawerContent payload={payload} isPhone={isPhone} /> : null}
        </Drawer>
    )
}

function AccountsDrawerContent({ payload, isPhone }: { payload: AccountsDrawerPayload, isPhone: boolean }) {
    return (
        <DrawerContent
            className={cn("border-0! p-0 w-full", isPhone ? "rounded-t-[24px]!" : "rounded-none! max-w-110")}
            overlayClassName="bg-ink-soft/50"
        >
            {payload.type === "account"
                ? <AccountDetails id={payload.id} />
                : <CreditCardDetails id={payload.id} />}
        </DrawerContent>
    )
}

// ---------- pieces both panels share (UI only) ----------

function PanelHeader({ kind, name }: { kind: string, name: string }) {
    return (
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
            <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wider uppercase text-slate">{kind}</p>
                <DrawerTitle className="text-[22px] leading-7 font-bold text-[#11142B] truncate">{name}</DrawerTitle>
            </div>
            <DrawerClose render={<button aria-label="Close" className="size-10 -mr-2 -mt-1 grid place-items-center rounded-full text-[#11142B] cursor-pointer hover:bg-bg"><X size={20} strokeWidth={1.8} /></button>} />
        </div>
    )
}

function InfoList({ title, rows }: { title: string, rows: { label: string, value: string }[] }) {
    return (
        <section>
            <h4 className="text-sm font-semibold text-[#11142B] mb-3">{title}</h4>
            <ul className="rounded-[20px] border border-[#E6E9F4] overflow-hidden">
                {rows.map(row => (
                    <li key={row.label} className="flex justify-between gap-4 px-4 py-3.5 text-sm border-b border-[#EEF0F7] last:border-b-0">
                        <span className="text-slate">{row.label}</span>
                        <span className="font-semibold text-[#11142B] text-right">{row.value}</span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

// only the empty state for now, the real list comes with the transactions module
function RecentTransactions() {
    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-[#11142B]">Recent transactions</h4>
                <button type="button" className="text-[13px] font-semibold text-[#2A3BC4] cursor-pointer">View all</button>
            </div>
            <div className="rounded-[20px] border border-dashed border-[#D5DAF0] px-4 py-6 flex flex-col items-center text-center gap-1">
                <span className="size-10 grid place-items-center rounded-full bg-[#E6EAFF] text-[#2A3BC4] mb-2"><ArrowLeftRight size={18} strokeWidth={1.8} /></span>
                <p className="text-sm font-semibold text-[#11142B]">No transactions yet</p>
                <p className="text-[13px] text-slate">Transactions you record will appear here.</p>
            </div>
        </section>
    )
}

function PanelBody({ children }: { children: ReactNode }) {
    return <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 flex flex-col gap-6">{children}</div>
}

// Edit and Archive/Restore keep the handlers they already had
function PanelFooter({ kind, id, isActive, onStatusChange }: { kind: AccountsKind, id: string, isActive: boolean, onStatusChange: () => void }) {
    return (
        <div className="shrink-0 flex gap-3 px-5 pt-3 pb-5 max-md:border-t max-md:border-[#EEF0F7]">
            <DialogTrigger
                handle={ACCOUNTS_DIALOG_HANLDE}
                payload={{ mode: "edit", type: kind, id }}
                render={<Button variant="outline" className="h-12 flex-1 rounded-full gap-2 font-semibold" onClick={() => ACCOUNTS_DRAWER_HANDLE.close()}><PencilLine size={16} /> Edit</Button>}
            />
            {isActive
                ? <Button className="h-12 flex-1 rounded-full gap-2 font-semibold bg-[#FFE4E4] text-[#B42318] hover:bg-[#FFD6D6]" onClick={onStatusChange}><Archive size={16} /> Archive</Button>
                : <Button className="h-12 flex-1 rounded-full gap-2 font-semibold bg-[#E6EAFF] text-[#2A3BC4] hover:bg-[#D9DFFF]" onClick={onStatusChange}><RotateCcw size={16} /> Restore</Button>}
        </div>
    )
}

// ---------- account ----------

function AccountDetails({ id }: { id: string }) {
    const account = useSelector((state: RootState) => state.accountsSlice.accounts.find(acc => acc.id === id));
    const balance = useSelector((state: RootState) => selectAccountBalance(state, id));
    if (!account) return null;

    const isActive = account.status === "active";
    const Icon = AccountsTypeIconMap[account.type];
    const shades = getColorShades(account.color);

    return (
        <>
            <PanelHeader kind="Account" name={account.name} />
            <PanelBody>
                <div className="rounded-[28px] p-5" style={{ background: shades.soft }}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="size-[52px] shrink-0 grid place-items-center rounded-2xl bg-white/70" style={{ color: shades.ink }}><Icon size={22} strokeWidth={1.8} /></span>
                            <span className="font-semibold text-[#11142B] truncate">{AccountsTypeNameMap[account.type]}</span>
                        </div>
                        {isActive
                            ? <Badge className="bg-green-soft text-green rounded-full px-3">Active</Badge>
                            : <Badge className="bg-coral-soft text-coral rounded-full px-3">Archived</Badge>}
                    </div>
                    <p className="mt-5 text-4xl font-bold tracking-tight text-[#11142B] break-all">{formatCurrency(balance)}</p>
                    <p className="mt-1 text-xs font-semibold tracking-wider uppercase text-slate">AVAILABLE BALANCE</p>
                </div>

                <InfoList title="Account information" rows={[
                    { label: "Account type", value: AccountsTypeNameMap[account.type] },
                    { label: "Opening balance", value: formatCurrency(account.openingBalance) },
                    { label: "Status", value: isActive ? "Active" : "Archived" },
                ]} />

                <RecentTransactions />
            </PanelBody>
            <PanelFooter kind="account" id={id} isActive={isActive} onStatusChange={() => accountsServices.setAccountStatus(id, isActive ? "archived" : "active")} />
        </>
    )
}

// ---------- credit card ----------

function CreditCardDetails({ id }: { id: string }) {
    const card = useSelector((state: RootState) => state.accountsSlice.creditCards.find(c => c.id === id));
    const outstanding = useSelector((state: RootState) => selectCreditCardOutstanding(state, id));
    if (!card) return null;

    const isActive = card.status === "active";
    const utilization = card.creditLimit > 0 ? (outstanding / card.creditLimit) * 100 : 0;
    const { paymentStatus, formattedDueDate } = getDueInfo(card.paymentDueDate, card.totalDueAmount);

    return (
        <>
            <PanelHeader kind="Credit card" name={card.name} />
            <PanelBody>
                <div className="rounded-[28px] p-5 text-white" style={{ background: card.color }}>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="size-11 shrink-0 grid place-items-center rounded-full bg-white/15"><CreditCard size={20} strokeWidth={1.8} /></span>
                            <span className="font-semibold truncate">{AccountsTypeNameMap["credit-card"]}</span>
                        </div>
                        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{isActive ? paymentStatus : "Archived"}</span>
                    </div>
                    <p className="mt-5 text-xs font-semibold tracking-wider uppercase text-white/75">OUTSTANDING BALANCE</p>
                    <p className="mt-1 text-4xl font-bold tracking-tight break-all">{formatCurrency(outstanding)}</p>
                    <div className="mt-4 h-1.5 rounded-full bg-white/25 overflow-hidden">
                        <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(utilization, 100)}%` }} />
                    </div>
                    <p className="mt-2 text-xs font-medium text-white/90">{utilization.toFixed(0)}% of {formatCurrency(card.creditLimit)} used</p>
                </div>

                <InfoList title="Card information" rows={[
                    { label: "Credit limit", value: formatCurrency(card.creditLimit) },
                    { label: "Available credit", value: formatCurrency(card.creditLimit - outstanding) },
                    { label: "Statement day", value: String(card.statementDate) },
                    { label: "Payment due day", value: String(card.paymentDueDate) },
                    { label: "Next payment due", value: formattedDueDate },
                    { label: "Status", value: isActive ? "Active" : "Archived" },
                ]} />

                <RecentTransactions />
            </PanelBody>
            <PanelFooter kind="credit-card" id={id} isActive={isActive} onStatusChange={() => accountsServices.setCreditCardStatus(id, isActive ? "archived" : "active")} />
        </>
    )
}
