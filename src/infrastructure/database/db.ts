import Dexie, { type EntityTable } from "dexie";
import type { Accounts, CreditCardAccount } from "@/modules/accounts/accounts.model";

// one database for the whole app, each table is typed with its model + primary key
export const db = new Dexie("money-manager") as Dexie & {
  accounts: EntityTable<Accounts, "id">;
  creditCards: EntityTable<CreditCardAccount, "id">;
};

// only the primary key and the fields we want to search/filter by are listed here,
// other fields of the object are still saved, they just aren't indexed.
// when a table or index changes later, add db.version(2) instead of editing this one.
db.version(1).stores({
  accounts: "id, type, status",
  creditCards: "id, status",
});
