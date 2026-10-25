export type AccountsType = "cash" | "bank" | "digital-wallet" | "credit-card";
export type Accounts = {
  id: string;
  name: string;
  type: AccountsType;
  openingBalance: number;
  color: string;
  status: "active" | "archived";
};

export type CreditCardAccount = {
  id: string;
  name: string;
  type: "credit-card";

  outstandingBalance: number;
  currentStatementAmount: number;
  totalDueAmount: number;

  creditLimit: number;
  statementDate: number;
  paymentDueDate: number;

  color: string;
  status: "active" | "archived";
};

export type AccountInputValues = Pick<Accounts, "name" | "type" | "openingBalance" | "color">;

export type CreditCardInputValues = Pick<
  CreditCardAccount,
  "name" | "creditLimit" | "outstandingBalance" | "statementDate" | "paymentDueDate" | "color"
>;

// what the dialog edits, numbers are strings while typing so an empty input can really be empty
export type AccountFormValues = Omit<AccountInputValues, "openingBalance"> & {
  openingBalance: string;
};

export type CreditCardFormValues = Omit<
  CreditCardInputValues,
  "creditLimit" | "outstandingBalance" | "statementDate" | "paymentDueDate"
> & {
  creditLimit: string;
  outstandingBalance: string;
  statementDate: string;
  paymentDueDate: string;
};

export type AccountsKind = "account" | "credit-card";

export type AccountsDialogPayload =
  | { mode: "create"; type: AccountsKind }
  | { mode: "edit"; type: AccountsKind; id: string };

export type AccountsDrawerPayload = {
  id: string;
  type: AccountsKind;
};

export type AccountsStatusFilter = Accounts["status"];
