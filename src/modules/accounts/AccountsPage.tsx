import { useState } from "react";
import { AccountsDialogBox } from "./components/AccountsDialogBox";
import AccountsDisplayPanel from "./components/AccountsDisplayPanel";
import AccountsDrawer from "./components/AccountsDrawer";
import AccountsFilterPanel from "./components/AccountsFilterPanel";
import AccountsSummaryPanel from "./components/AccountsSummaryPanel";
import CreditCardDisplayPanel from "./components/CreditCardDisplayPanel";
import type { AccountsStatusFilter } from "./accounts.model";

export default function AccountsPage() {
    const [status, setStatus] = useState<AccountsStatusFilter>("active");

    return (
        <div className="flex flex-col gap-5">
            <AccountsSummaryPanel />
            <AccountsFilterPanel status={status} onStatusChange={setStatus} />
            <AccountsDrawer />
            <AccountsDialogBox/>
            <AccountsDisplayPanel status={status} />
            <CreditCardDisplayPanel status={status} />
        </div>
    )
}
