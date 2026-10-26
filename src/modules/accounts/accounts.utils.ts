// pure helpers for the accounts module, nothing here reads the store or the db.
// the lists they need are passed in by accounts.services.ts

// money can have max 2 decimals (BR-GEN-002)
export function hasValidAmount(amount: number) {
  return Number.isFinite(amount) && Math.round(amount * 100) / 100 === amount;
}

export function isValidDayOfMonth(day: number) {
  return Number.isInteger(day) && day >= 1 && day <= 31;
}

// the next payment due date of a credit card and a short status text for it.
// paymentDueDay is the day of the month (1-31), `outstanding` is what is owed now.
// days are counted as whole calendar days, so a card that is due today says "Due today" (not next month).
// a day that a month does not have (the 31st in April) is the last day of that month
export function getDueInfo(paymentDueDay: number, outstanding: number, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const dueIn = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(paymentDueDay, daysInMonth));
  };

  // this month's date is already gone, so the next one is next month
  let dueDate = dueIn(today.getFullYear(), today.getMonth());
  if (dueDate < today) {
    dueDate = dueIn(today.getFullYear(), today.getMonth() + 1);
  }

  // rounded because a day is not always 24 hours (clocks change)
  const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / 86_400_000);

  const paymentStatus =
    outstanding <= 0
      ? "Paid"
      : daysUntilDue === 0
        ? "Due today"
        : `Due in ${daysUntilDue}d`;

  const formattedDueDate = dueDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return { paymentStatus, formattedDueDate, daysUntilDue };
}
