import TransactionListItem from "./TransactionListItem";
import { transactions } from "../transaction-mock-data";

export default function TransactionList(){
    return(
        <ul>
            {transactions.map(el=><TransactionListItem key={el.id} {...el}/>)}
        </ul>
    )
}