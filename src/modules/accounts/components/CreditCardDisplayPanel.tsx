import { useSelector } from "react-redux";
import { selectSortedCreditCards } from "../accounts.selectors";
import { CreditCardDisplayCard } from "./CreditCardDisplayCard";
import type { AccountsStatusFilter } from "../accounts.model";

export default function CreditCardDisplayPanel({ status }: { status: AccountsStatusFilter }) {
    const cards = useSelector(selectSortedCreditCards).filter(card => card.status === status);

    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-lg font-bold">Credit Cards</h1>
            {cards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {cards.map(acc => (
                        <CreditCardDisplayCard key={acc.id} account={acc} />
                    ))}
                </div>
            ) : (
                <p className="text-slate">No {status} credit cards.</p>
            )}
        </div>
    )
}
