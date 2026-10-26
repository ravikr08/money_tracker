import { appStore } from "@/app/app.store";
// DEXIE OFF (for now): the db is switched off so a refresh brings back everything, even deleted items.
// every line to bring back is marked with "DEXIE OFF"
// import { accountRepository, creditCardRepository } from "@/infrastructure/repositories/account.repository";
import { DUMMY_ACCOUNTS, DUMMY_CREDIT_CARDS } from "./accounts.dummy-data";
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
import { hasValidAmount, isValidDayOfMonth } from "./accounts.utils";
import { transactionServices } from "@/modules/transactions/transaction.services";
import { isUniqueName } from "@/shared/utils/utils";

const accountsStore = {
  get() {
    return appStore.getState().accountsSlice;
  },
  dispatch: appStore.dispatch,
};

export const accountsServices = {
  // startup, puts the accounts in the store
  async load() {
    // DEXIE OFF: reads everything from the db
    // const [accounts, creditCards] = await Promise.all([
    //   accountRepository.getAll(),
    //   creditCardRepository.getAll(),
    // ]);
    // accountsStore.dispatch(accountsLoaded({ accounts, creditCards }));

    // dummy data instead. copies, so the dummy lists themselves are never changed
    accountsStore.dispatch(accountsLoaded({
      accounts: DUMMY_ACCOUNTS.map((acc) => ({ ...acc })),
      creditCards: DUMMY_CREDIT_CARDS.map((card) => ({ ...card })),
    }));
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

  // what is owed on the card now: the opening outstanding plus the spending with the card minus the bill payments (BR-FIN-002).
  // the transactions module works out what the transactions did
  getCreditCardOutstanding(id: string) {
    const card = this.getCreditCardById(id);
    const { net } = transactionServices.getCreditCardMovement(id);
    return Math.round((card.outstandingBalance + net) * 100) / 100;
  },

  // validation
  // accounts and cards share the name check, both show up in the same pickers later
  // deleted ones are ignored so their name can be used again
  isUniqueAccountName(name: string, id: string) {
    const { accounts, creditCards } = accountsStore.get();
    const live = [...accounts, ...creditCards].filter((el) => el.status !== "deleted");
    return isUniqueName(name, live, id);
  },

  // returns the error message or "" when everything is fine
  validateAccount(input: AccountInputValues, id: string) {
    if (input.name.trim() === "") return "Account name is required.";
    if (!this.isUniqueAccountName(input.name, id)) return "Account name already exist.";
    if (!hasValidAmount(input.openingBalance)) return "Opening balance can have at most 2 decimals.";
    return "";
  },

  validateCreditCard(input: CreditCardInputValues, id: string) {
    if (input.name.trim() === "") return "Card name is required.";
    if (!this.isUniqueAccountName(input.name, id)) return "Account name already exist.";
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

    // DEXIE OFF
    // try {
    //   await accountRepository.add(account);
    // } catch {
    //   return { success: false, error: "Could not save the account." };
    // }
    accountsStore.dispatch(accountAdded({ newAccount: account }));

    return { success: true, message: "Account created successfully." };
  },

  async updateAccount(input: AccountInputValues, id: string) {
    const error = this.validateAccount(input, id);
    if (error) {
      return { success: false, error };
    }

    const changes = { ...input, name: input.name.trim() };
    // DEXIE OFF
    // try {
    //   await accountRepository.update(id, changes);
    // } catch {
    //   return { success: false, error: "Could not save the account." };
    // }
    accountsStore.dispatch(accountUpdated({ id, changes }));

    return { success: true, message: "Account updated successfully." };
  },

  // archived accounts stay in history, they just can't get new transactions (BR-ACC-004)
  async setAccountStatus(id: string, status: Accounts["status"]) {
    // DEXIE OFF
    // await accountRepository.update(id, { status });
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
      // a new card has no transactions, so what is owed now is the opening outstanding
      status: "active",
    };

    // DEXIE OFF
    // try {
    //   await creditCardRepository.add(card);
    // } catch {
    //   return { success: false, error: "Could not save the credit card." };
    // }
    accountsStore.dispatch(creditCardAdded({ newCard: card }));

    return { success: true, message: "Credit card created successfully." };
  },

  async updateCreditCard(input: CreditCardInputValues, id: string) {
    const error = this.validateCreditCard(input, id);
    if (error) {
      return { success: false, error };
    }

    // the form shows what is owed now, so what is typed is that. the card stores the opening outstanding, which is that
    // without what the transactions did to the card
    const { net } = transactionServices.getCreditCardMovement(id);
    const changes = {
      ...input,
      name: input.name.trim(),
      outstandingBalance: Math.round((input.outstandingBalance - net) * 100) / 100,
    };
    // DEXIE OFF
    // try {
    //   await creditCardRepository.update(id, changes);
    // } catch {
    //   return { success: false, error: "Could not save the credit card." };
    // }
    accountsStore.dispatch(creditCardUpdated({ id, changes }));

    return { success: true, message: "Credit card updated successfully." };
  },

  async setCreditCardStatus(id: string, status: CreditCardAccount["status"]) {
    // DEXIE OFF
    // await creditCardRepository.update(id, { status });
    accountsStore.dispatch(creditCardUpdated({ id, changes: { status } }));
  },
};
