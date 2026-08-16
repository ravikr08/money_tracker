
import {
    Dialog,
} from "@/shared/components/ui/dialog"
import { createInitialSubCategory, SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";

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
import type { CategoryInputValues, SubcategoryDialogPayload, SubcategoryInputValues } from "../category.model"
import { categoryServices } from "../category.services";

// fields
import { Field, FieldGroup } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { type Dispatch, type SetStateAction } from "react";


export function SubcategoryDialogBox() {
    return (
        <Dialog handle={SUBCATEGORY_DIALOG_HANDLE}>
            {({ payload }) => (payload && SUBCATEGORY_DIALOG_HANDLE.isOpen) ? <SubcategoryDialogBoxContent payload={payload} /> : null}
        </Dialog>
    )
}



type DraftType = { data: SubcategoryInputValues, res?: { success: boolean, error?: string, message?: string } }

function getDraftData(payload: SubcategoryDialogPayload): DraftType {
    if (payload.mode === "create") {
        return { data: createInitialSubCategory() }
    } else {
        const subcategory = categoryServices.getSubCategoryById(payload.id, payload.categoryId)
        const draftData = {
            name: subcategory.name,
        }
        return { data: draftData }
    }
}

function SubcategoryDialogBoxContent({ payload }: { payload: SubcategoryDialogPayload }) {
    const [draft, setDraft] = useState<DraftType>(() => getDraftData(payload));

    function handleSave(e) {
        let res;
        if (payload.mode === "create") {
            res = categoryServices.createSubcategory(draft.data, payload.categoryId)
        } else {
            res = categoryServices.updateSubcategory(draft.data, payload.id, payload.categoryId)
        }

        setDraft(prev => ({ ...prev, res: res }))
        if (res.success) {
            SUBCATEGORY_DIALOG_HANDLE.close()
        }
    }

    useEffect(() => {
        setDraft(() => getDraftData(payload));
    }, [payload])

    return (<DialogContent className="px-7 py-6 sm:max-w-xl" >
        <DialogHeader>
            <DialogTitle>{(payload.mode === "edit" ? "Edit" : "New") + " " + "Subcategory"}</DialogTitle>
            <DialogDescription>A finer split within this category.</DialogDescription>
        </DialogHeader>
        <SubcategoryDialogBoxFields draft={draft} setDraft={setDraft} />
        <DialogFooter className="bg-white">
            <DialogClose render={<Button variant="outline" className={"px-5 py-5"} >Cancel</Button>} />
            <Button type="submit" className={"px-5 py-5 aria-disabled:cursor-not-allowed"} onClick={handleSave} disabled={draft.data.name.trim() === ""}>Save Changes</Button>
        </DialogFooter>
    </DialogContent>)
}



type propsType = {
    draft: DraftType, setDraft: Dispatch<SetStateAction<DraftType>>
}
function SubcategoryDialogBoxFields({ draft, setDraft }: propsType) {

    function handleFieldValueChange(key: keyof CategoryInputValues, value: string) {
        setDraft((prev) => {
            return {
                ...prev,
                data: { ...prev.data, [key]: value },
                res: undefined
            }

        })
    }


    return (
        <FieldGroup>
            <Field>
                <Label className="text-slate">Name</Label>
                <Input name="name" placeholder="e.g Food & Dining" className="rounded-sm shadow-none ring-0 focus-visible:ring-0 px-3 py-5 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed" value={draft.data.name} onChange={(e) => handleFieldValueChange('name', e.target.value)} required={true} />
                {draft.res?.error && <span className={"bg-red-0 text-red-500 text-right rounded-sm"}>{draft.res.error}</span>}
            </Field>
        </FieldGroup >
    )
}