
import {
  Dialog,
} from "@/shared/components/ui/dialog"
import { CATEGORY_DIALOG_HANDLE } from "../category.constants";

// content box
import { Button } from "@/shared/components/ui/button"

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { useEffect, useState } from "react";
import type { CategoryDialogPayload, CategoryInputValues, CategoryTypes } from "../category.model"
import { categoryServices } from "../category.services";
import { createInitialCategory } from "../category.constants";

// fields
import { Field, FieldGroup } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import TabMenu from "@/shared/components/TabMenu";
import { type Dispatch, type SetStateAction } from "react";
import { AVAILABLE_CATEGORY_COLORS, AVAILABLE_CATEGORY_ICONS } from "../category.constants";
import { cn } from "@/shared/lib/utils";


export function CategoryDialogBox() {
  return (
    <Dialog handle={CATEGORY_DIALOG_HANDLE}>
      {({ payload }) => (payload && CATEGORY_DIALOG_HANDLE.isOpen) ? <CategoryDialogBoxContent payload={payload} /> : null}
    </Dialog>
  )
}



type DraftType = { origin: "custom" | "default", data: CategoryInputValues, res?: { success: boolean, error?: string, message?: string } }

function getDraftData(payload: CategoryDialogPayload): DraftType {
  if (payload.mode === "create") {
    return { origin: "custom", data: createInitialCategory() }
  } else {
    const category = categoryServices.getCategoryById(payload.id)
    const draftData = {
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type
    }
    return { origin: category.origin, data: draftData }
  }
}

function CategoryDialogBoxContent({ payload }: { payload: CategoryDialogPayload }) {
  const [draft, setDraft] = useState<DraftType>(() => getDraftData(payload));

  function handleSave(e) {
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

  return (<DialogContent className="px-7 py-6 sm:max-w-xl" >
    <DialogHeader>
      <DialogTitle>{(payload.mode === "edit" ? "Edit" : "New") + " " + "Category"}</DialogTitle>
      <DialogDescription>Categories organise your transactions into meaningful groups.</DialogDescription>
      {(draft.origin === "default") && <DialogDescription className={"bg-amber-50 p-2 rounded-sm"}>
        🔒 This is a default category — its name and type are fixed, but you can still change its icon, colour, or archive it.
      </DialogDescription>}
    </DialogHeader>
    <CategoryDialogBoxFields draft={draft} setDraft={setDraft} />
    <DialogFooter className="bg-white">
      <DialogClose render={<Button variant="outline" className={"px-5 py-5"} >Cancel</Button>} />
      <Button type="submit" className={"px-5 py-5 aria-disabled:cursor-not-allowed"} onClick={handleSave} disabled={draft.data.name.trim() === ""}>Save Changes</Button>
    </DialogFooter>
  </DialogContent>)
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
    <FieldGroup>
      <Field>
        <Label className="text-slate">Name</Label>
        <Input disabled={draft.origin === "default"} aria-disabled={draft.origin === "default"} name="name" placeholder="e.g Food & Dining" className="rounded-sm shadow-none ring-0 focus-visible:ring-0 px-3 py-5 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed" value={draft.data.name} onChange={(e) => handleFieldValueChange('name', e.target.value)} required={true} />
        {draft.res?.error && <span className={"bg-red-0 text-red-500 text-right rounded-sm"}>{draft.res.error}</span>}
      </Field>
      <Field>
        <Label className="text-slate">Transaction Type</Label>
        <TabMenu tabs={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }]} selectedTab={draft.data.type} onTabChange={(newVal: CategoryTypes) => handleFieldValueChange("type", newVal)} bgClass="bg-blue-soft rounded-sm w-full py-5.5" btnActiveClass="rounded-sm py-4" disabled={draft.origin === "default"} />
      </Field>
      <Field>
        <Label className="text-slate">Color</Label>
        <div className="flex gap-2.5 flex-wrap">
          {AVAILABLE_CATEGORY_COLORS.map(color => <button key={color} className={cn("flex items-center justify-center w-8 h-8 rounded-sm text-white cursor-pointer", draft.data.color === color && "border-2 border-black")} style={{ background: color }} onClick={() => handleFieldValueChange("color", color)}>{draft.data.color === color && "✔"}</button>)}
        </div>
      </Field>
      <Field>
        <Label className="text-slate">Icons</Label>
        <div className="flex gap-2.5 flex-wrap w-full h-35 overflow-y-scroll scroll">
          {AVAILABLE_CATEGORY_ICONS.map(icon => <button key={icon} className={cn("flex items-center justify-center w-10 h-10 text-xl rounded-sm text-white cursor-pointer bg-blue-100", draft.data.icon === icon && "border-2 border-[#8B7CF6]")} onClick={() => handleFieldValueChange("icon", icon)}>{icon}</button>)}
        </div>
      </Field>
    </FieldGroup >
  )
}