import { useSelector } from "react-redux";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import AccountsSummaryCard from "./AccountsSummaryCard"
import {
    selectActiveAccountsCount,
    selectActiveCreditCardsCount,
    selectTotalAccountsCount,
    selectTotalBalance,
    selectTotalDue,
} from "../accounts.selectors";
import { formatCurrency } from "@/shared/utils/utils";


export default function AccountsSummaryPanel(){
    const totalBalance = useSelector(selectTotalBalance);
    const totalDue = useSelector(selectTotalDue);
    const activeAccounts = useSelector(selectActiveAccountsCount);
    const activeCards = useSelector(selectActiveCreditCardsCount);
    const totalCount = useSelector(selectTotalAccountsCount);
    const activeCount = activeAccounts + activeCards;

    return(
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            <AccountsSummaryCard title="Total Balance" value={formatCurrency(totalBalance)} icon={Wallet} desc={`${activeAccounts} active accounts`} isMain className="max-md:col-span-2" />
            <AccountsSummaryCard title="Total Due" value={formatCurrency(totalDue)} icon={CreditCard} desc={`${activeCards} credit cards`} />
            <AccountsSummaryCard title="Accounts" value={String(totalCount)} icon={Landmark} desc={`${activeCount} active ${totalCount - activeCount} acrhived`} />
        </div>
    )
}
