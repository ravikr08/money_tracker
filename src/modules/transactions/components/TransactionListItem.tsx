import type { Transaction } from "../transaction.model"
import { BanknoteArrowUp, BanknoteArrowDown, BanknoteCheck, ArrowRightLeft } from "lucide-react"


const iconTypes = {
    income : <BanknoteArrowUp/>,
    expense : <BanknoteArrowDown/>,
    transfer : <ArrowRightLeft/>,
    payment : <BanknoteCheck/>
}

export default function TransactionListItem(transaction: Transaction){
    return(
        <li className="flex border-2 rounded-sm">
            <span>{iconTypes[transaction.type]}</span>
            <span>{transaction.categoryId}</span>
            <span>{transaction.amount}</span>
            <span>{transaction.title}</span>
            {transaction.fromAccountId && <span>{transaction.fromAccountId}</span>}
            {transaction.toAccountId && <span>{transaction.toAccountId}</span>}
            <span>{transaction.transactionDate}</span>
        </li>
    )
}