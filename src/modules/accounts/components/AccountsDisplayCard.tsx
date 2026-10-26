import Card from "@/shared/components/ui/Card";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import type { Accounts } from "../accounts.model";
import { AccountsTypeIconMap, AccountsTypeNameMap, ACCOUNTS_DRAWER_HANDLE } from "../accounts.constants";
import { selectAccountBalance } from "../accounts.selectors";
import { DrawerTrigger } from "@/shared/components/ui/drawer";
import AccountsMenuPopup from "./AccountsMenuPopup";
import { formatCurrency, getColorShades } from "@/shared/utils/utils";
import { cn } from "@/shared/lib/utils";


export default function AccountsDisplayCard({ account }: { account: Accounts }) {
    const balance = useSelector((state: RootState) => selectAccountBalance(state, account.id));
    const isActive = account.status === "active";
    const Icon = AccountsTypeIconMap[account.type];
    const shades = getColorShades(account.color);

    // phone: one row [icon] [name + type] [balance] [menu]
    // tablet and desktop: the icon and name on top, the balance below
    return (
        <Card className={cn("w-full relative max-md:rounded-[20px] max-md:p-4", !isActive && "opacity-60")}>
            <DrawerTrigger handle={ACCOUNTS_DRAWER_HANDLE} payload={{ id: account.id, type: "account" }} className={"w-full h-full flex flex-col gap-5 items-start cursor-pointer absolute top-0 left-0"}>
            </DrawerTrigger>
            <div className="grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr] items-center gap-x-3 md:gap-y-5">
                <div className="size-11 rounded-[12px] md:size-12 md:rounded-md flex justify-center items-center" style={{ background: shades.soft, color: shades.ink }}>
                    <Icon size={22} strokeWidth={1.8} />
                </div>
                <div className="text-left min-w-0">
                    <h3 className="type-item-title font-semibold truncate">{account.name}</h3>
                    <span className="type-caption text-gray-400">{AccountsTypeNameMap[account.type]}</span>
                </div>
                <div className="text-right md:text-left md:col-span-2 md:row-start-2 md:order-last">
                    <h1 className="type-section-title font-bold">{formatCurrency(balance)}</h1>
                    <span className="type-micro tracking-wide text-gray-400">AVAILABLE BALANCE</span>
                </div>
                <div className="max-md:relative max-md:z-10 md:absolute md:right-4 md:top-5 hover:bg-blue-soft size-9 md:size-6 flex items-center justify-center rounded-[6px]"><AccountsMenuPopup id={account.id} type="account" isActive={isActive} /></div>
            </div>
        </Card>
    )
}
