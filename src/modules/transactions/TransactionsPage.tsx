import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { selectTransactionFilters } from "./transactions.selectors";
import { TRANSACTION_EDIT_HANDLE } from "./transactions.constants";
import { TransactionDeleteDialog, TransactionEditDialog } from "./components/TransactionDialogs"
import TransactionDetailsDrawer from "./components/TransactionDetailsDrawer"
import TransactionCalendar from "./components/TransactionCalendar"
import TransactionList  from "./components/TransactionsList"
import TransactionsSummary from "./components/TransactionsSummary"
import TransactionsToolbar from "./components/TransactionsToolbar"

// UI only for now, the title is in the header of the app
export default function TransactionPage(){
    const view = useSelector(selectTransactionFilters).view;
    return(
        <div className="flex flex-col gap-3.5 md:gap-4 xl:gap-5">
            <TransactionsSummary />
            <TransactionsToolbar />
            {/* the calendar replaces the list when "Calendar" is picked in the view dropdown */}
            {view === "calendar" ? <TransactionCalendar /> : <TransactionList/>}

            <TransactionDetailsDrawer />
            <TransactionEditDialog />
            <TransactionDeleteDialog />

            {/* phone only: the new transaction button floats above the bottom menu */}
            <button type="button" onClick={() => TRANSACTION_EDIT_HANDLE.openWithPayload({})} aria-label="New transaction" className="md:hidden fixed right-4 bottom-[92px] z-30 size-12 grid place-items-center rounded-full bg-[#0E7C6B] text-white shadow-[0_6px_16px_rgba(14,124,107,0.35)] cursor-pointer">
                <Plus size={22} strokeWidth={2.2} />
            </button>
        </div>

    )
}
