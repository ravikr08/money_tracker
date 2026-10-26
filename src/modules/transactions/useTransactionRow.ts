import { useSelector } from "react-redux";
import { KINDS, formatAmount } from "./components/transactionKinds";
import { selectAccountNames, selectCategoryNames, selectSubCategoryNames } from "./transactions.selectors";
import { parseLocalDate } from "./transactions.utils";
import type { Transaction } from "./transaction.model";

// everything a row of a transaction shows, in one place for every list that has rows (the transactions page, the dashboard).
// the ids are stored, the names are looked up. deleted accounts and categories are only marked as deleted,
// so they keep their name here. the fallback is only for the moment before the accounts are loaded from the db
export function useTransactionRow(transaction: Transaction) {
    const categoryNames = useSelector(selectCategoryNames);
    const subCategoryNames = useSelector(selectSubCategoryNames);
    const accountNames = useSelector(selectAccountNames);

    const name = (names: Record<string, string>, id?: string) => (id ? names[id] ?? "" : "");
    const categoryName = name(categoryNames, transaction.categoryId);
    const category = transaction.subCategoryId ? `${categoryName} › ${name(subCategoryNames, transaction.subCategoryId)}` : categoryName;
    const account = transaction.fromAccountId && transaction.toAccountId
        ? `${name(accountNames, transaction.fromAccountId)} → ${name(accountNames, transaction.toAccountId)}`
        : name(accountNames, transaction.fromAccountId ?? transaction.toAccountId);

    return {
        kind: KINDS[transaction.type],
        isArchived: transaction.isArchived ?? false,
        title: transaction.title ?? categoryName,
        note: transaction.note,
        category,
        account,
        date: parseLocalDate(transaction.transactionDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        amount: formatAmount(transaction),
    };
}
