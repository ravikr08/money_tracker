import { db } from "../database/db";
import type { Accounts, CreditCardAccount } from "@/modules/accounts/accounts.model";

// repositories only read/write data, no business rules here.
// validation (unique name etc) stays in accounts.services.ts

export const accountRepository = {
  getAll() {
    return db.accounts.toArray();
  },

  getById(id: string) {
    return db.accounts.get(id);
  },

  add(account: Accounts) {
    return db.accounts.add(account);
  },

  update(id: string, changes: Partial<Accounts>) {
    return db.accounts.update(id, changes);
  },

  // used by the future "delete" rule check, accounts with history can't be deleted
  remove(id: string) {
    return db.accounts.delete(id);
  },
};

export const creditCardRepository = {
  getAll() {
    return db.creditCards.toArray();
  },

  getById(id: string) {
    return db.creditCards.get(id);
  },

  add(card: CreditCardAccount) {
    return db.creditCards.add(card);
  },

  update(id: string, changes: Partial<CreditCardAccount>) {
    return db.creditCards.update(id, changes);
  },

  remove(id: string) {
    return db.creditCards.delete(id);
  },
};
