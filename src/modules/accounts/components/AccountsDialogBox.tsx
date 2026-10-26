import { useEffect, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog"
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

// phone: a sheet from the bottom with a small handle. tablet and desktop: a box in the middle (same as the dialogs of the transactions)
const SHEET = "gap-0 rounded-[28px] bg-white p-0 sm:max-w-[480px] max-h-[90dvh] overflow-hidden flex flex-col max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:translate-x-0 max-md:translate-y-0 max-md:max-w-full max-md:sm:max-w-full max-md:rounded-b-none";
// the form scrolls if the screen is really small, but without the ugly scrollbar
const BODY = "flex-1 min-h-0 overflow-y-auto px-6 pb-5 flex flex-col gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const labelClass = "type-label font-semibold text-[#586079]";
const fieldClass = "h-12 w-full min-w-0 rounded-xl border border-[#E2E6F3] bg-white px-4 type-item-title text-[#1B2240] outline-0 placeholder:text-[#9AA1B8] focus-within:border-[#3347E0]";
const saveClass = "h-12 w-full rounded-full bg-[#3347E0] hover:bg-[#2A3BC4] type-body font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

// the sheet shows the short names of the account types
const TYPE_LABELS: Record<string, string> = { "bank": "Bank", "cash": "Cash", "digital-wallet": "Digital wallet" };

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
    <DialogContent showCloseButton={false} className={SHEET}>
      <Handle />
      <SheetHeader title={payload.mode === "edit" ? "Edit Account" : "New Account"} />
      <div className={BODY}>
        <FormField label="Type">
          <ul className="grid grid-cols-3 gap-2">
            {ACCOUNT_TYPE_OPTIONS.map(option => {
              const isSelected = draft.data.type === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleFieldValueChange("type", option.value)}
                    className={cn(
                      "w-full h-[68px] rounded-md border flex flex-col items-center justify-center gap-1.5 type-caption font-semibold cursor-pointer",
                      isSelected ? "border-[#3347E0] bg-[#EEF0FF] text-[#3347E0]" : "border-transparent bg-[#F1F3FB] text-[#586079]"
                    )}
                  >
                    <option.icon className="size-5" strokeWidth={1.8} />
                    {TYPE_LABELS[option.value] ?? option.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </FormField>

        <FormField label="Name">
          <input
            name="name"
            placeholder="e.g. HDFC Savings"
            className={fieldClass}
            value={draft.data.name}
            onChange={(e) => handleFieldValueChange("name", e.target.value)}
          />
          {draft.res?.error && <span className="type-body text-[#D92D20] text-right">{draft.res.error}</span>}
        </FormField>

        <FormField label="Opening balance">
          <MoneyInput name="openingBalance" value={draft.data.openingBalance} onChange={(value) => handleFieldValueChange("openingBalance", value)} />
        </FormField>

        <ColorField colors={AVAILABLE_ACCOUNT_COLORS} selected={draft.data.color} onSelect={(color) => handleFieldValueChange("color", color)} />
      </div>
      <div className="shrink-0 px-6 py-4 border-t border-[#EEF2F0]">
        <button type="button" className={saveClass} onClick={handleSave} disabled={draft.data.name.trim() === ""}>
          {payload.mode === "edit" ? "Save changes" : "Add account"}
        </button>
      </div>
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
    <DialogContent showCloseButton={false} className={SHEET}>
      <Handle />
      <SheetHeader title={payload.mode === "edit" ? "Edit Credit Card" : "New Credit Card"} />
      <div className={BODY}>
        <FormField label="Name">
          <input
            name="name"
            placeholder="e.g. HDFC Millennia"
            className={fieldClass}
            value={draft.data.name}
            onChange={(e) => handleFieldValueChange("name", e.target.value)}
          />
          {draft.res?.error && <span className="type-body text-[#D92D20] text-right">{draft.res.error}</span>}
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Credit limit">
            <MoneyInput name="creditLimit" value={draft.data.creditLimit} onChange={(value) => handleFieldValueChange("creditLimit", value)} />
          </FormField>
          <FormField label="Outstanding">
            <MoneyInput name="outstandingBalance" value={draft.data.outstandingBalance} onChange={(value) => handleFieldValueChange("outstandingBalance", value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Statement day">
            <input
              type="number"
              name="statementDate"
              min={1}
              max={31}
              className={fieldClass}
              value={draft.data.statementDate}
              onChange={(e) => handleFieldValueChange("statementDate", e.target.value)}
            />
          </FormField>
          <FormField label="Payment due day">
            <input
              type="number"
              name="paymentDueDate"
              min={1}
              max={31}
              className={fieldClass}
              value={draft.data.paymentDueDate}
              onChange={(e) => handleFieldValueChange("paymentDueDate", e.target.value)}
            />
          </FormField>
        </div>

        <ColorField colors={AVAILABLE_CREDIT_CARD_COLORS} selected={draft.data.color} onSelect={(color) => handleFieldValueChange("color", color)} />
      </div>
      <div className="shrink-0 px-6 py-4 border-t border-[#EEF2F0]">
        <button type="button" className={saveClass} onClick={handleSave} disabled={draft.data.name.trim() === ""}>
          {payload.mode === "edit" ? "Save changes" : "Add credit card"}
        </button>
      </div>
    </DialogContent>
  )
}

// ---------- shared ----------

function Handle() {
  return <span className="md:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-[#D5DAEE]"></span>
}

function SheetHeader({ title }: { title: string }) {
  return (
    <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
      <DialogTitle className="type-section-title font-semibold text-[#1B2240]">{title}</DialogTitle>
      <DialogClose render={<button aria-label="Close" className="size-10 -mr-2 -mt-1 grid place-items-center rounded-full text-[#1B2240] cursor-pointer hover:bg-[#EEF0FF]"><X size={20} strokeWidth={1.8} /></button>} />
    </div>
  )
}

function FormField({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className={labelClass}>{label}</span>
      {children}
    </div>
  )
}

function MoneyInput({ name, value, onChange }: { name: string, value: string, onChange: (value: string) => void }) {
  return (
    <label className={cn(fieldClass, "flex items-center gap-2 py-0")}>
      <span className="text-[#586079]">₹</span>
      <input
        type="number"
        name={name}
        placeholder="0"
        className="flex-1 min-w-0 border-0 outline-0 bg-transparent type-item-title text-[#1B2240] placeholder:text-[#9AA1B8]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function ColorField({ colors, selected, onSelect }: { colors: string[], selected: string, onSelect: (color: string) => void }) {
  return (
    <FormField label="Colour">
      <div className="flex gap-3 flex-wrap p-1">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color}
            className="size-8 grid place-items-center rounded-full text-white cursor-pointer"
            style={{ background: color, boxShadow: selected === color ? `0 0 0 2px #fff, 0 0 0 4px ${color}` : undefined }}
            onClick={() => onSelect(color)}
          >
            {selected === color && <Check size={16} strokeWidth={3} />}
          </button>
        ))}
      </div>
    </FormField>
  )
}
