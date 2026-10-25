import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Field, FieldGroup } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { cn } from "@/shared/lib/utils";
import {
  ACCOUNTS_DIALOG_HANLDE,
  ACCOUNT_TYPE_OPTIONS,
  AVAILABLE_ACCOUNT_COLORS,
  AVAILABLE_CREDIT_CARD_COLORS,
  createInitialAccount,
  createInitialCreditCard,
} from "../accounts.constants";
import { accountsServices } from "../accounts.services";
import type {
  AccountFormValues,
  AccountsDialogPayload,
  CreditCardFormValues,
} from "../accounts.model"

type Result = { success: boolean, error?: string, message?: string }

const inputClass = "rounded-sm shadow-none ring-0 focus-visible:ring-0 px-3 py-5";
// scrolls if the screen is really small, but without the ugly scrollbar
const contentClass = "px-4 py-5 sm:px-7 sm:py-6 sm:max-w-lg max-h-[90dvh] overflow-y-auto [scrollbar-width:none]! [&::-webkit-scrollbar]:hidden";

export function AccountsDialogBox() {
  return (
    <Dialog handle={ACCOUNTS_DIALOG_HANLDE}>
      {({ payload }) => {
        if (!payload || !ACCOUNTS_DIALOG_HANLDE.isOpen) return null;
        return payload.type === "account"
          ? <AccountDialogContent payload={payload} />
          : <CreditCardDialogContent payload={payload} />
      }}
    </Dialog>
  )
}

// ---------- account ----------

type AccountDraft = { data: AccountFormValues, res?: Result }

function getAccountDraft(payload: AccountsDialogPayload): AccountDraft {
  if (payload.mode === "create") {
    return { data: createInitialAccount() }
  }
  const account = accountsServices.getAccountById(payload.id)
  return {
    data: {
      name: account.name,
      type: account.type,
      openingBalance: String(account.openingBalance),
      color: account.color,
    }
  }
}

function AccountDialogContent({ payload }: { payload: AccountsDialogPayload }) {
  const [draft, setDraft] = useState<AccountDraft>(() => getAccountDraft(payload));

  // the first render can still have the payload of the previous open, same as in CategoryDialogBox
  useEffect(() => {
    setDraft(getAccountDraft(payload));
  }, [payload])

  function handleFieldValueChange(key: keyof AccountFormValues, value: string) {
    setDraft((prev) => ({
      ...prev,
      data: { ...prev.data, [key]: value },
      // an old name error isn't true anymore after typing
      res: key === "name" ? undefined : prev.res,
    }))
  }

  async function handleSave() {
    const input = { ...draft.data, openingBalance: Number(draft.data.openingBalance) }
    const res = payload.mode === "create"
      ? await accountsServices.createAccount(input)
      : await accountsServices.updateAccount(input, payload.id)

    setDraft(prev => ({ ...prev, res }))
    if (res.success) {
      ACCOUNTS_DIALOG_HANLDE.close()
    }
  }

  return (
    <DialogContent className={contentClass}>
      <DialogHeader>
        <DialogTitle>{payload.mode === "edit" ? "Edit Account" : "New Account"}</DialogTitle>
        <DialogDescription>Accounts are the places where your money is kept.</DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label className="text-slate">Account Type</Label>
          <ul className="grid grid-cols-3 gap-2">
            {ACCOUNT_TYPE_OPTIONS.map(option => (
              <li
                key={option.value}
                className={cn("h-20 rounded-md cursor-pointer text-center leading-[1.2] p-1.5 bg-blue-soft flex flex-col items-center justify-center gap-1", draft.data.type === option.value && "border border-blue-500")}
                onClick={() => handleFieldValueChange("type", option.value)}
              >
                <option.icon className="size-6" strokeWidth={1.8} />
                <span className="text-[12px]">{option.label}</span>
              </li>
            ))}
          </ul>
        </Field>

        <Field>
          <Label className="text-slate">Account Name</Label>
          <Input
            name="name"
            placeholder="e.g. HDFC Savings"
            className={inputClass}
            value={draft.data.name}
            onChange={(e) => handleFieldValueChange("name", e.target.value)}
          />
          {draft.res?.error && <span className="text-red-500 text-right rounded-sm">{draft.res.error}</span>}
        </Field>

        <Field>
          <Label className="text-slate">Opening Balance</Label>
          <Input
            type="number"
            name="openingBalance"
            placeholder="0"
            className={inputClass}
            value={draft.data.openingBalance}
            onChange={(e) => handleFieldValueChange("openingBalance", e.target.value)}
          />
        </Field>

        <ColorField colors={AVAILABLE_ACCOUNT_COLORS} selected={draft.data.color} onSelect={(color) => handleFieldValueChange("color", color)} />
      </FieldGroup>
      <DialogFooter className="bg-white">
        <DialogClose render={<Button variant="outline" className="px-5 py-5">Cancel</Button>} />
        <Button className="px-5 py-5" onClick={handleSave} disabled={draft.data.name.trim() === ""}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  )
}

// ---------- credit card ----------

type CreditCardDraft = { data: CreditCardFormValues, res?: Result }

function getCreditCardDraft(payload: AccountsDialogPayload): CreditCardDraft {
  if (payload.mode === "create") {
    return { data: createInitialCreditCard() }
  }
  const card = accountsServices.getCreditCardById(payload.id)
  return {
    data: {
      name: card.name,
      creditLimit: String(card.creditLimit),
      outstandingBalance: String(card.outstandingBalance),
      statementDate: String(card.statementDate),
      paymentDueDate: String(card.paymentDueDate),
      color: card.color,
    }
  }
}

function CreditCardDialogContent({ payload }: { payload: AccountsDialogPayload }) {
  const [draft, setDraft] = useState<CreditCardDraft>(() => getCreditCardDraft(payload));

  useEffect(() => {
    setDraft(getCreditCardDraft(payload));
  }, [payload])

  function handleFieldValueChange(key: keyof CreditCardFormValues, value: string) {
    setDraft((prev) => ({
      ...prev,
      data: { ...prev.data, [key]: value },
      res: key === "name" ? undefined : prev.res,
    }))
  }

  async function handleSave() {
    const input = {
      ...draft.data,
      creditLimit: Number(draft.data.creditLimit),
      outstandingBalance: Number(draft.data.outstandingBalance),
      statementDate: Number(draft.data.statementDate),
      paymentDueDate: Number(draft.data.paymentDueDate),
    }
    const res = payload.mode === "create"
      ? await accountsServices.createCreditCard(input)
      : await accountsServices.updateCreditCard(input, payload.id)

    setDraft(prev => ({ ...prev, res }))
    if (res.success) {
      ACCOUNTS_DIALOG_HANLDE.close()
    }
  }

  return (
    <DialogContent className={contentClass}>
      <DialogHeader>
        <DialogTitle>{payload.mode === "edit" ? "Edit Credit Card" : "New Credit Card"}</DialogTitle>
        <DialogDescription>A credit card is borrowed money, what you owe is its outstanding balance.</DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <Label className="text-slate">Card Name</Label>
          <Input
            name="name"
            placeholder="e.g. HDFC Millennia"
            className={inputClass}
            value={draft.data.name}
            onChange={(e) => handleFieldValueChange("name", e.target.value)}
          />
          {draft.res?.error && <span className="text-red-500 text-right rounded-sm">{draft.res.error}</span>}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-slate">Credit Limit</Label>
            <Input
              type="number"
              name="creditLimit"
              placeholder="0"
              className={inputClass}
              value={draft.data.creditLimit}
              onChange={(e) => handleFieldValueChange("creditLimit", e.target.value)}
            />
          </Field>
          <Field>
            <Label className="text-slate">Outstanding Balance</Label>
            <Input
              type="number"
              name="outstandingBalance"
              placeholder="0"
              className={inputClass}
              value={draft.data.outstandingBalance}
              onChange={(e) => handleFieldValueChange("outstandingBalance", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-slate">Statement Day</Label>
            <Input
              type="number"
              name="statementDate"
              min={1}
              max={31}
              className={inputClass}
              value={draft.data.statementDate}
              onChange={(e) => handleFieldValueChange("statementDate", e.target.value)}
            />
          </Field>
          <Field>
            <Label className="text-slate">Payment Due Day</Label>
            <Input
              type="number"
              name="paymentDueDate"
              min={1}
              max={31}
              className={inputClass}
              value={draft.data.paymentDueDate}
              onChange={(e) => handleFieldValueChange("paymentDueDate", e.target.value)}
            />
          </Field>
        </div>

        <ColorField colors={AVAILABLE_CREDIT_CARD_COLORS} selected={draft.data.color} onSelect={(color) => handleFieldValueChange("color", color)} />
      </FieldGroup>
      <DialogFooter className="bg-white">
        <DialogClose render={<Button variant="outline" className="px-5 py-5">Cancel</Button>} />
        <Button className="px-5 py-5" onClick={handleSave} disabled={draft.data.name.trim() === ""}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  )
}

// ---------- shared ----------

function ColorField({ colors, selected, onSelect }: { colors: string[], selected: string, onSelect: (color: string) => void }) {
  return (
    <Field>
      <Label className="text-slate">Colour</Label>
      <div className="flex gap-2 sm:gap-2.5 flex-wrap">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={cn(
              "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-sm text-white cursor-pointer",
              selected === color && "border-2 border-black",
            )}
            style={{ background: color }}
            onClick={() => onSelect(color)}
          >
            {selected === color && "✓"}
          </button>
        ))}
      </div>
    </Field>
  )
}
