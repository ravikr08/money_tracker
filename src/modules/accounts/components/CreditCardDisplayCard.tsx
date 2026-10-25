import { useSelector } from "react-redux";
import type { RootState } from "@/app/app.store";
import type { CreditCardAccount } from "../accounts.model";
import { ACCOUNTS_DRAWER_HANDLE } from "../accounts.constants";
import { selectCreditCardOutstanding } from "../accounts.selectors";
import { DrawerTrigger } from "@/shared/components/ui/drawer";
import AccountsMenuPopup from "./AccountsMenuPopup";
import { cn } from "@/shared/lib/utils";
import { formatCurrency } from "@/shared/utils/utils";
import { CreditCard } from "lucide-react";

type CreditCardProps = {
  account: CreditCardAccount;
};

export function CreditCardDisplayCard({ account }: CreditCardProps) {
  const outstanding = useSelector((state: RootState) => selectCreditCardOutstanding(state, account.id));
  const isActive = account.status === "active";

  const utilization =
    account.creditLimit > 0
      ? (outstanding / account.creditLimit) * 100
      : 0;

  const today = new Date();

  const dueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    account.paymentDueDate
  );

  if (dueDate < today) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }

  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const paymentStatus =
    account.totalDueAmount <= 0
      ? "Paid"
      : daysUntilDue === 0
        ? "Due today"
        : `Due in ${daysUntilDue}d`;

  const formattedDueDate = dueDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const icon = (
    <span className="size-11 md:size-12 shrink-0 grid place-items-center rounded-full bg-white/15"><CreditCard size={20} strokeWidth={1.8} /></span>
  );
  const menu = (
    <div className="relative z-10 size-11 md:size-10 shrink-0 grid place-items-center rounded-full bg-white/15 hover:bg-white/25"><AccountsMenuPopup id={account.id} type="credit-card" isActive={isActive} /></div>
  );
  const progress = (
    <div className="h-1.5 flex-1 rounded-full bg-white/25 overflow-hidden">
      <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(utilization, 100)}%` }} />
    </div>
  );

  // the whole card opens the details. phone is one row with the amount on the right,
  // tablet and desktop have the amount on its own line
  return (
    <div
      className={cn("relative rounded-[24px] p-4 md:p-6 text-white w-full", !isActive && "opacity-60")}
      style={{ backgroundColor: account.color }}
    >
      <DrawerTrigger handle={ACCOUNTS_DRAWER_HANDLE} payload={{ id: account.id, type: "credit-card" }} className="absolute inset-0 rounded-[24px] cursor-pointer" />

      {/* phone */}
      <div className="md:hidden">
        <div className="flex items-center gap-3">
          {icon}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold truncate">{account.name}</h3>
            <p className="text-[13px] text-white/75">{paymentStatus} · {formattedDueDate}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold leading-7">{formatCurrency(outstanding)}</p>
            <p className="text-[10px] font-bold tracking-wider text-white/80">OUTSTANDING</p>
          </div>
          {menu}
        </div>
        <div className="mt-3 flex items-center gap-3">
          {progress}
          <span className="text-[13px] text-white/90">{utilization.toFixed(0)}% used</span>
        </div>
      </div>

      {/* tablet and desktop */}
      <div className="hidden md:block">
        <div className="flex items-center gap-3">
          {icon}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold truncate">{account.name}</h3>
            <p className="text-[13px] text-white/75">Credit card · {paymentStatus}</p>
          </div>
          {menu}
        </div>
        <div className="mt-6 flex items-end justify-between gap-3">
          <p className="text-[32px] font-bold leading-9">{formatCurrency(outstanding)}</p>
          <p className="text-xs font-bold tracking-wider text-white/80">OUTSTANDING</p>
        </div>
        <div className="mt-3 flex items-center gap-4">
          {progress}
          <span className="text-[13px] text-white/90">{utilization.toFixed(0)}% used · due {formattedDueDate}</span>
        </div>
      </div>
    </div>
  );
}
