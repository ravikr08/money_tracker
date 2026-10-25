import { useSelector } from "react-redux";
import AccountsDisplayCard from "../components/AccountsDisplayCard";
import { selectSortedAccounts } from "../accounts.selectors";
import type { AccountsStatusFilter } from "../accounts.model";


export default function AccountsDisplayPanel({ status }: { status: AccountsStatusFilter }) {
    const accounts = useSelector(selectSortedAccounts).filter(acc => acc.status === status);

    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-lg font-bold">Accounts</h1>
            {accounts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {accounts.map(acc => (
                        <AccountsDisplayCard key={acc.id} account={acc} />
                    ))}
                </div>
            ) : (
                <p className="text-slate">No {status} accounts.</p>
            )}
        </div>
    )
}
