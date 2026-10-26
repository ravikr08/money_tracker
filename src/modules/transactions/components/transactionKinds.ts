import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/shared/utils/utils";
import type { Transaction, TransactionTypes } from "../transaction.model";

// look of each kind: label, icon, colours of the tile and colour of the amount
export const KINDS: Record<TransactionTypes, { label: string, icon: LucideIcon, tile: string, amount: string }> = {
    income: { label: "Income", icon: ArrowDownLeft, tile: "bg-[#DDF3EE] text-[#0A5F52]", amount: "text-[#0B7A4B]" },
    expense: { label: "Expense", icon: ArrowUpRight, tile: "bg-[#FFEFE6] text-[#B4531A]", amount: "text-[#11201E]" },
    transfer: { label: "Transfer", icon: ArrowLeftRight, tile: "bg-[#E6EAFF] text-[#2A3BC4]", amount: "text-[#5A6B68]" },
    payment: { label: "Card payment", icon: CreditCard, tile: "bg-[#EFE8FF] text-[#5B3FC4]", amount: "text-[#5B3FC4]" },
}

// income and expense get a sign, transfers and card payments only move money so they have none
export function formatAmount(t: Transaction) {
    if (t.type === "income") return "+" + formatCurrency(t.amount);
    if (t.type === "expense") return "−" + formatCurrency(t.amount);
    return formatCurrency(t.amount);
}
