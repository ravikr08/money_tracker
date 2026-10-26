import type { TransactionGroupData } from "../transactions.utils";
import { formatSigned } from "../transactions.utils";
import TransactionRow from "./TransactionRow";

// one day: a title with the day total, then its rows.
// phone: the rows are one rounded block on the page. tablet and desktop: the title is a grey bar inside the white table
export default function TransactionGroup({ group }: { group: TransactionGroupData }) {
    return (
        <div className="flex flex-col max-md:gap-2">
            <div className="flex items-baseline justify-between gap-3 max-md:px-1 md:px-5 md:pt-3.5 md:pb-2 md:bg-[#F7FAF9] md:border-t md:border-[#EAEFED]">
                <h2 className="type-label font-semibold tracking-[0.04em] uppercase text-[#5A6B68]">
                    {group.label} <span className="hidden xl:inline font-medium normal-case tracking-normal">· {group.count} {group.count === 1 ? "transaction" : "transactions"}</span>
                </h2>
                <span className={`type-label font-semibold ${group.net > 0 ? "text-[#0B7A4B]" : "text-[#5A6B68]"}`}>{formatSigned(group.net)}</span>
            </div>
            <div className="flex flex-col max-md:gap-px max-md:rounded-[20px] max-md:overflow-hidden max-md:bg-[#EAEFED]">
                {group.rows.map(t => <TransactionRow key={t.id} transaction={t} />)}
            </div>
        </div>
    )
}
