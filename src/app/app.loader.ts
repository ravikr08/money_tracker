import { accountsServices } from "@/modules/accounts/accounts.services";

// everything that has to be in the store before the first page shows.
// a module with saved data adds its load() to this list, App.tsx and the router stay the same
export async function appLoader() {
  await Promise.all([
    accountsServices.load(),
  ]);
  // router loaders can't return undefined
  return null;
}
