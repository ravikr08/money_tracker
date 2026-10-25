// next payment due date of a credit card, how many days are left and the text for the status.
// used by the card and by the details panel
export function getDueInfo(paymentDueDate: number, totalDueAmount: number) {
  const today = new Date();

  const dueDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    paymentDueDate
  );

  if (dueDate < today) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }

  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
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

  return { daysUntilDue, paymentStatus, formattedDueDate };
}
