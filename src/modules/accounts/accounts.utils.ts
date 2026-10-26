// pure helpers for the accounts module, nothing here reads the store or the db.
// the lists they need are passed in by accounts.services.ts

// money can have max 2 decimals (BR-GEN-002)
export function hasValidAmount(amount: number) {
  return Number.isFinite(amount) && Math.round(amount * 100) / 100 === amount;
}

export function isValidDayOfMonth(day: number) {
  return Number.isInteger(day) && day >= 1 && day <= 31;
}

// RECREATED after being overwritten by mistake, compare with your git / editor history version
// next payment due date of a credit card and a short status text for it
// paymentDueDay is the day of the month (1-31)
export function getDueInfo(paymentDueDay: number, totalDueAmount: number) {
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth(), paymentDueDay);

  // this month's date is already gone, so the next one is next month
  if (dueDate < today) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }

  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const paymentStatus =
    totalDueAmount <= 0
      ? "Paid"
      : daysUntilDue === 0
        ? "Due today"
        : `Due in ${daysUntilDue}d`;

  const formattedDueDate = dueDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return { paymentStatus, formattedDueDate };
}
