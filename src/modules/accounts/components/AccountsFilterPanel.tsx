import TabMenu from "@/shared/components/TabMenu";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { ACCOUNTS_DIALOG_HANLDE, ACCOUNT_STATUS_OPTIONS } from "../accounts.constants";
import type { AccountsStatusFilter } from "../accounts.model";

const newButtonClass = "bg-blue max-md:px-2 px-5 py-5 max-md:justify-center cursor-pointer rounded-full hover:bg-blue-dark font-bold flex gap-2 text-white items-center";

export default function AccountsFilterPanel({ status, onStatusChange }: { status: AccountsStatusFilter, onStatusChange: (status: AccountsStatusFilter) => void }) {
    return (
        <div className="w-full flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-between md:items-center">
            <TabMenu tabs={ACCOUNT_STATUS_OPTIONS} selectedTab={status} onTabChange={onStatusChange} bgClass="w-full md:w-fit rounded-full md:rounded-xl" btnActiveClass="flex-1 md:flex-none rounded-full md:rounded-xl" />
            <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
                <DialogTrigger render={<Button className={newButtonClass}><Plus strokeWidth="3" /> <span className="text-sm">New Account</span></Button>} handle={ACCOUNTS_DIALOG_HANLDE} payload={{ mode: "create", type: "account" }} />
                <DialogTrigger render={<Button className={newButtonClass}><Plus strokeWidth="3" /> <span className="text-sm">New Credit Card</span></Button>} handle={ACCOUNTS_DIALOG_HANLDE} payload={{ mode: "create", type: "credit-card" }} />
            </div>
        </div>
    )
}
