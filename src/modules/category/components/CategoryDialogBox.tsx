import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { CATEGORY_DIALOG_HANDLE, AVAILABLE_CATEGORY_COLORS, AVAILABLE_CATEGORY_ICONS, createInitialCategory } from "../category.constants";
import type { CategoryDialogPayload, CategoryInputValues, CategoryTypes } from "../category.model"
import { categoryServices } from "../category.services";
import { CATEGORY_ICONS } from "../category.icons";
import { cn } from "@/shared/lib/utils";

// phone: a sheet from the bottom with a small handle. tablet and desktop: a box in the middle (same as the dialogs of the accounts)
const SHEET = "gap-0 rounded-[28px] bg-white p-0 sm:max-w-[480px] max-h-[90dvh] overflow-hidden flex flex-col max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:translate-x-0 max-md:translate-y-0 max-md:max-w-full max-md:sm:max-w-full max-md:rounded-b-none";
// the form scrolls if the screen is really small, but without the ugly scrollbar
const BODY = "flex-1 min-h-0 overflow-y-auto px-6 pb-5 flex flex-col gap-4 [scrollbar-width:none]! [&::-webkit-scrollbar]:hidden";
const labelClass = "type-label font-semibold text-[#586079]";
const TYPE_OPTIONS: { value: CategoryTypes, label: string }[] = [{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }];

export function CategoryDialogBox() {
  return (
    <Dialog handle={CATEGORY_DIALOG_HANDLE}>
      {({ payload }) => (payload && CATEGORY_DIALOG_HANDLE.isOpen) ? <CategoryDialogBoxContent payload={payload} /> : null}
    </Dialog>
  )
}

type DraftType = { data: CategoryInputValues, res?: { success: boolean, error?: string, message?: string } }

function getDraftData(payload: CategoryDialogPayload): DraftType {
  if (payload.mode === "create") {
    return { data: createInitialCategory() }
  } else {
    const category = categoryServices.getCategoryById(payload.id)
    const draftData = {
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type
    }
    return { data: draftData }
  }
}

function CategoryDialogBoxContent({ payload }: { payload: CategoryDialogPayload }) {
  const [draft, setDraft] = useState<DraftType>(() => getDraftData(payload));

  function handleSave() {
    let res;
    if (payload.mode === "create") {
      res = categoryServices.createCategory(draft.data)
    } else {
      res = categoryServices.updateCategory(draft.data, payload.id)
    }

    setDraft(prev => ({ ...prev, res: res }))
    if (res.success) {
      CATEGORY_DIALOG_HANDLE.close()
    }
  }

  useEffect(() => {
    setDraft(getDraftData(payload));
  }, [payload])

  return (
    <DialogContent showCloseButton={false} className={SHEET}>
      <span className="md:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-[#D5DAEE]"></span>
      <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4">
        <DialogTitle className="type-section-title font-semibold text-[#1B2240]">{(payload.mode === "edit" ? "Edit" : "New") + " " + "Category"}</DialogTitle>
        <DialogClose render={<button aria-label="Close" className="size-10 -mr-2 -mt-1 grid place-items-center rounded-full text-[#1B2240] cursor-pointer hover:bg-[#EEF0FF]"><X size={20} strokeWidth={1.8} /></button>} />
      </div>
      <div className={BODY}>
        <CategoryDialogBoxFields draft={draft} setDraft={setDraft} />
      </div>
      <div className="shrink-0 px-6 py-4 border-t border-[#EEF2F0]">
        <button type="button" onClick={handleSave} disabled={draft.data.name.trim() === ""} className="h-12 w-full rounded-full bg-[#3347E0] hover:bg-[#2A3BC4] type-body font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {payload.mode === "edit" ? "Save changes" : "Add category"}
        </button>
      </div>
    </DialogContent>
  )
}

type propsType = {
  draft: DraftType, setDraft: Dispatch<SetStateAction<DraftType>>
}
function CategoryDialogBoxFields({ draft, setDraft }: propsType) {

  function handleFieldValueChange(key: keyof CategoryInputValues, value: string) {
    setDraft((prev) => {
      return {
        ...prev,
        data: { ...prev.data, [key]: value },
        res: key === "name" ? undefined : prev.res
      }

    })
  }

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Name</span>
        <input
          name="name"
          placeholder="e.g. Food & Dining"
          required
          className="h-12 w-full min-w-0 rounded-xl border border-[#E2E6F3] bg-white px-4 type-item-title text-[#1B2240] outline-0 placeholder:text-[#9AA1B8] focus:border-[#3347E0]"
          value={draft.data.name}
          onChange={(e) => handleFieldValueChange('name', e.target.value)}
        />
        {draft.res?.error && <span className="type-body text-[#D92D20] text-right">{draft.res.error}</span>}
      </div>

      <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[#F1F3FB]" role="group" aria-label="Transaction type">
        {TYPE_OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleFieldValueChange("type", option.value)}
            className={cn("h-10 rounded-full type-label font-semibold cursor-pointer", draft.data.type === option.value ? "bg-[#0B0F1E] text-white" : "text-[#586079]")}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Colour</span>
        <div className="grid grid-cols-8 gap-2.5 p-1">
          {AVAILABLE_CATEGORY_COLORS.map(color => {
            const isSelected = draft.data.color === color;
            return (
              <button
                key={color}
                type="button"
                aria-label={color}
                className="aspect-square grid place-items-center rounded-sm text-white cursor-pointer"
                style={{ background: color, boxShadow: isSelected ? `0 0 0 2px #fff, 0 0 0 4px ${color}` : undefined }}
                onClick={() => handleFieldValueChange("color", color)}
              >
                {isSelected && <Check size={16} strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Icon</span>
        <div className="grid grid-cols-6 gap-2.5 max-h-[156px] overflow-y-auto p-1 [scrollbar-width:none]! [&::-webkit-scrollbar]:hidden">
          {AVAILABLE_CATEGORY_ICONS.map(icon => {
            const Icon = CATEGORY_ICONS[icon];
            const isSelected = draft.data.icon === icon;
            return (
              <button
                key={icon}
                type="button"
                aria-label={icon}
                className={cn("h-11 grid place-items-center rounded-sm border cursor-pointer", isSelected ? "border-[#3347E0] bg-[#EEF0FF] text-[#3347E0]" : "border-transparent bg-[#F1F3FB] text-[#586079]")}
                onClick={() => handleFieldValueChange("icon", icon)}
              >
                <Icon size={20} strokeWidth={1.8} />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
