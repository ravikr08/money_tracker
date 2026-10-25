import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/app.store";

export const selectAccounts = (state: RootState) => state.accountsSlice.accounts;
export const selectCreditCards = (state: RootState) => state.accountsSlice.creditCards;

// createSelector remembers the last result, so these return the same array
// until accounts really change (a plain .sort() inside useSelector would re-render every time)
export const selectSortedAccounts = createSelector([selectAccounts], (accounts) =>
  [...accounts].sort((a, b) => a.name.localeCompare(b.name)),
);
export const selectSortedCreditCards = createSelector([selectCreditCards], (cards) =>
  [...cards].sort((a, b) => a.name.localeCompare(b.name)),
);

// balance is derived from transactions (BR-FIN-001).
// there are no transactions yet so it's only the opening balance,
// when transactions are added only this function changes: opening + income/transfers in - expense/transfers out
export function selectAccountBalance(state: RootState, accountId: string) {
  const account = state.accountsSlice.accounts.find((acc) => acc.id === accountId);
  if (!account) return 0;
  return account.openingBalance;
}

// same idea for credit cards (BR-FIN-002), spending increases it, bill payments decrease it
export function selectCreditCardOutstanding(state: RootState, cardId: string) {
  const card = state.accountsSlice.creditCards.find((c) => c.id === cardId);
  if (!card) return 0;
  return card.outstandingBalance;
}

// 0.1 + 0.2 isn't 0.3 in js, so sums are rounded to 2 decimals (BR-GEN-002)
const round2 = (n: number) => Math.round(n * 100) / 100;

// summary cards, only active accounts are counted
// credit cards are not part of the balance, they only show up in the total due
export function selectTotalBalance(state: RootState) {
  return round2(
    state.accountsSlice.accounts
      .filter((acc) => acc.status === "active")
      .reduce((sum, acc) => sum + selectAccountBalance(state, acc.id), 0),
  );
}

export function selectTotalDue(state: RootState) {
  return round2(
    state.accountsSlice.creditCards
      .filter((card) => card.status === "active")
      .reduce((sum, card) => sum + selectCreditCardOutstanding(state, card.id), 0),
  );
}

export function selectActiveAccountsCount(state: RootState) {
  return state.accountsSlice.accounts.filter((acc) => acc.status === "active").length;
}

export function selectActiveCreditCardsCount(state: RootState) {
  return state.accountsSlice.creditCards.filter((card) => card.status === "active").length;
}

export function selectTotalAccountsCount(state: RootState) {
  return state.accountsSlice.accounts.length + state.accountsSlice.creditCards.length;
}
