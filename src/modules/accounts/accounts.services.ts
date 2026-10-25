import { appStore } from "@/app/app.store";
import { accountRepository, creditCardRepository } from "@/infrastructure/repositories/account.repository";
import {
  accountsLoaded,
  accountAdded,
  accountUpdated,
  creditCardAdded,
  creditCardUpdated,
} from "./accounts.slice";
import type {
  AccountInputValues,
  Accounts,
  CreditCardAccount,
  CreditCardInputValues,
} from "./accounts.model";

const accountsStore = {
  get() {
    return appStore.getState().accountsSlice;
  },
  dispatch: appStore.dispatch,
};

// money can have max 2 decimals (BR-GEN-002)
function hasValidAmount(amount: number) {
  return Number.isFinite(amount) && Math.round(amount * 100) / 100 === amount;
}

function isValidDayOfMonth(day: number) {
  return Number.isInteger(day) && day >= 1 && day <= 31;
}

export const accountsServices = {
  // startup, reads everything from the db into the store
  async load() {
    const [accounts, creditCards] = await Promise.all([
      accountRepository.getAll(),
      creditCardRepository.getAll(),
    ]);
    accountsStore.dispatch(accountsLoaded({ accounts, creditCards }));
  },

  // get
  getAccountById(id: string): Accounts {
    const account = accountsStore.get().accounts.find((acc) => acc.id === id);
    if (!account) {
      throw new Error(`Account not found: ${id}`);
    }
    return account;
  },

  getCreditCardById(id: string): CreditCardAccount {
    const card = accountsStore.get().creditCards.find((c) => c.id === id);
    if (!card) {
      throw new Error(`Credit card not found: ${id}`);
    }
    return card;
  },

  // validation
  // accounts and cards share the name check, both show up in the same pickers later
  isUniqueName(name: string, id: string) {
    const { accounts, creditCards } = accountsStore.get();
    const newName = name.trim().toLowerCase();
    return ![...accounts, ...creditCards].some(
      (el) => el.name.trim().toLowerCase() === newName && el.id !== id,
    );
  },

  // returns the error message or "" when everything is fine
  validateAccount(input: AccountInputValues, id: string) {
    if (input.name.trim() === "") return "Account name is required.";
    if (!this.isUniqueName(input.name, id)) return "Account name already exist.";
    if (!hasValidAmount(input.openingBalance)) return "Opening balance can have at most 2 decimals.";
    return "";
  },

  validateCreditCard(input: CreditCardInputValues, id: string) {
    if (input.name.trim() === "") return "Card name is required.";
    if (!this.isUniqueName(input.name, id)) return "Account name already exist.";
    if (!hasValidAmount(input.creditLimit) || input.creditLimit <= 0) return "Credit limit must be more than 0.";
    // outstanding balance can't be negative (BR-CC-004)
    if (!hasValidAmount(input.outstandingBalance) || input.outstandingBalance < 0) return "Outstanding balance can't be negative.";
    if (!isValidDayOfMonth(input.statementDate) || !isValidDayOfMonth(input.paymentDueDate)) return "Dates must be a day between 1 and 31.";
    return "";
  },

  // account
  async createAccount(input: AccountInputValues) {
    const id = crypto.randomUUID();
    const error = this.validateAccount(input, id);
    if (error) {
      return { success: false, error };
    }

    const account: Accounts = {
      ...input,
      name: input.name.trim(),
      id: id,
      status: "active",
    };

    try {
      await accountRepository.add(account);
    } catch {
      return { success: false, error: "Could not save the account." };
    }
    accountsStore.dispatch(accountAdded({ newAccount: account }));

    return { success: true, message: "Account created successfully." };
  },

  async updateAccount(input: AccountInputValues, id: string) {
    const error = this.validateAccount(input, id);
    if (error) {
      return { success: false, error };
    }

    const changes = { ...input, name: input.name.trim() };
    try {
      await accountRepository.update(id, changes);
    } catch {
      return { success: false, error: "Could not save the account." };
    }
    accountsStore.dispatch(accountUpdated({ id, changes }));

    return { success: true, message: "Account updated successfully." };
  },

  // archived accounts stay in history, they just can't get new transactions (BR-ACC-004)
  async setAccountStatus(id: string, status: Accounts["status"]) {
    await accountRepository.update(id, { status });
    accountsStore.dispatch(accountUpdated({ id, changes: { status } }));
  },

  // credit card
  async createCreditCard(input: CreditCardInputValues) {
    const id = crypto.randomUUID();
    const error = this.validateCreditCard(input, id);
    if (error) {
      return { success: false, error };
    }

    const card: CreditCardAccount = {
      ...input,
      name: input.name.trim(),
      id: id,
      type: "credit-card",
      // these two will be derived from transactions later, for now same as outstanding
      currentStatementAmount: input.outstandingBalance,
      totalDueAmount: input.outstandingBalance,
      status: "active",
    };

    try {
      await creditCardRepository.add(card);
    } catch {
      return { success: false, error: "Could not save the credit card." };
    }
    accountsStore.dispatch(creditCardAdded({ newCard: card }));

    return { success: true, message: "Credit card created successfully." };
  },

  async updateCreditCard(input: CreditCardInputValues, id: string) {
    const error = this.validateCreditCard(input, id);
    if (error) {
      return { success: false, error };
    }

    const changes = {
      ...input,
      name: input.name.trim(),
      currentStatementAmount: input.outstandingBalance,
      totalDueAmount: input.outstandingBalance,
    };
    try {
      await creditCardRepository.update(id, changes);
    } catch {
      return { success: false, error: "Could not save the credit card." };
    }
    accountsStore.dispatch(creditCardUpdated({ id, changes }));

    return { success: true, message: "Credit card updated successfully." };
  },

  async setCreditCardStatus(id: string, status: CreditCardAccount["status"]) {
    await creditCardRepository.update(id, { status });
    accountsStore.dispatch(creditCardUpdated({ id, changes: { status } }));
  },
};
