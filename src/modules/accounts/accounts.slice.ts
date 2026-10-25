import { createSlice } from "@reduxjs/toolkit";
import type { Accounts, CreditCardAccount } from "./accounts.model";

// filled from the db on startup, see accountsServices.load()
const initialState = {
  accounts: [] as Accounts[],
  creditCards: [] as CreditCardAccount[],
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    accountsLoaded(state, action) {
      const { accounts, creditCards } = action.payload;
      state.accounts = accounts;
      state.creditCards = creditCards;
    },

    // account
    accountAdded(state, action) {
      const { newAccount } = action.payload;
      state.accounts.push(newAccount);
    },
    accountUpdated(state, action) {
      const { id, changes } = action.payload;
      state.accounts = state.accounts.map((el) =>
        el.id !== id ? el : { ...el, ...changes },
      );
    },

    // credit card
    creditCardAdded(state, action) {
      const { newCard } = action.payload;
      state.creditCards.push(newCard);
    },
    creditCardUpdated(state, action) {
      const { id, changes } = action.payload;
      state.creditCards = state.creditCards.map((el) =>
        el.id !== id ? el : { ...el, ...changes },
      );
    },
  },
});

export const {
  accountsLoaded,
  accountAdded,
  accountUpdated,
  creditCardAdded,
  creditCardUpdated,
} = accountsSlice.actions;

export default accountsSlice.reducer;
