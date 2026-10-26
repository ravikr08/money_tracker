import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import { createInitialSubCategory, SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";
import type { SubcategoryDialogPayload, SubcategoryInputValues } from "../category.model"
import { categoryServices } from "../category.services";

// phone: a sheet from the bottom with a small handle. tablet and desktop: a box in the middle (same as the category dialog)
const SHEET = "gap-0 rounded-[28px] bg-white p-0 sm:max-w-[480px] max-h-[90dvh] overflow-hidden flex flex-col max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:translate-x-0 max-md:translate-y-0 max-md:max-w-full max-md:sm:max-w-full max-md:rounded-b-none";

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
    const categoryName = categoryServices.getCategoryById(payload.categoryId).name;
    // the cursor starts in the name box, not on the close button
    const nameRef = useRef<HTMLInputElement>(null);

    function handleSave() {
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

    return (
        <DialogContent showCloseButton={false} initialFocus={nameRef} className={SHEET}>
            <span className="md:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-[#D5DAEE]"></span>
            <div className="flex items-start justify-between gap-3 px-6 pt-4 pb-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="type-micro font-semibold tracking-[0.06em] uppercase text-[#586079] truncate">In {categoryName}</span>
                    <DialogTitle className="type-section-title font-semibold text-[#1B2240]">{(payload.mode === "edit" ? "Edit" : "New") + " " + "Subcategory"}</DialogTitle>
                </div>
                <DialogClose render={<button aria-label="Close" className="size-10 -mr-2 -mt-1 grid place-items-center rounded-full text-[#1B2240] cursor-pointer hover:bg-[#EEF0FF]"><X size={20} strokeWidth={1.8} /></button>} />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-5 flex flex-col gap-1.5 [scrollbar-width:none]! [&::-webkit-scrollbar]:hidden">
                <span className="type-label font-semibold text-[#586079]">Name</span>
                <input
                    ref={nameRef}
                    name="name"
                    placeholder="e.g. Groceries"
                    required
                    className="h-12 w-full min-w-0 rounded-xl border border-[#E2E6F3] bg-white px-4 type-item-title text-[#1B2240] outline-0 placeholder:text-[#9AA1B8] focus:border-[#3347E0]"
                    value={draft.data.name}
                    onChange={(e) => setDraft(prev => ({ ...prev, data: { ...prev.data, name: e.target.value }, res: undefined }))}
                />
                {draft.res?.error && <span className="type-body text-[#D92D20] text-right">{draft.res.error}</span>}
            </div>
            <div className="shrink-0 px-6 py-4 border-t border-[#EEF2F0]">
                <button type="button" onClick={handleSave} disabled={draft.data.name.trim() === ""} className="h-12 w-full rounded-full bg-[#3347E0] hover:bg-[#2A3BC4] type-body font-semibold text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    {payload.mode === "edit" ? "Save changes" : "Add subcategory"}
                </button>
            </div>
        </DialogContent>
    )
}
