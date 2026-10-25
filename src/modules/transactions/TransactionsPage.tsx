import { Plus } from "lucide-react";
import TransactionList  from "./components/TransactionsList"
import TransactionsSummary from "./components/TransactionsSummary"
import TransactionsToolbar from "./components/TransactionsToolbar"

// UI only for now, the title is in the header of the app
export default function TransactionPage(){
    return(
        <div className="flex flex-col gap-3.5 md:gap-4 xl:gap-5">
            <TransactionsSummary />
            <TransactionsToolbar />
            <TransactionList/>

            {/* phone only: the new transaction button floats above the bottom menu */}
            <button type="button" aria-label="New transaction" className="md:hidden fixed right-4 bottom-[92px] z-30 size-12 grid place-items-center rounded-full bg-[#0E7C6B] text-white shadow-[0_6px_16px_rgba(14,124,107,0.35)] cursor-pointer">
                <Plus size={22} strokeWidth={2.2} />
            </button>
        </div>

    )
}
