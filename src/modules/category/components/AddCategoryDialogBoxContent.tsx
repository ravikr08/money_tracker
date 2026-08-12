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
import type { DialogPayload } from "../category.model"
import { useCategoryStore } from "../category.store"
import AddCategoryDialogBoxFields from "./AddCategoryDialogBoxFields"
import { createCategory, createSubcategory, updateCategory, updateSubcategory } from "../category.services";


export default function AddCategoryDialogBoxContent({ payload }: { payload: DialogPayload }) {
    const [draft, setDraft] = useState<DialogPayload>({ ...payload });


    function handleCatSave() {
        let res = {}
        if (draft.mode === "create") {
            if (draft.type === "category") {
                res = createCategory(draft.data);
            } else {
                createSubcategory(draft.data, draft.data.categoryId)
            }
        }
        else if (draft?.mode === "edit") {
            if (draft.type === "category") {
                updateCategory(draft.data);
            } else {
                updateSubcategory(draft.data)
            }
        }
    }

    function getDialogTitle() {
        const mode = draft.mode === "edit" ? "Edit" : "New";
        const titleType = draft.type === "category" ? "Category" : "SubCategory for " + draft.data.categoryId;
        return mode + " " + titleType;
    }

    function getDialogDesc() {
        return draft.type === "category" ? "Categories organise your transactions into meaningful groups." : "A finer split within this category."
    }

    useEffect(() => {
        if (payload.data) {
            setDraft({ ...payload });
        }
    }, [payload.data])

    return (<DialogContent className="px-7 py-6 sm:max-w-xl" >
        <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDesc()}</DialogDescription>
            {(draft.type === "category" && draft.data.origin === "default") && <DialogDescription className={"bg-amber-50 p-2 rounded-sm"}>
                🔒 This is a default category — its name and type are fixed, but you can still change its icon, colour, or archive it.
            </DialogDescription>}
        </DialogHeader>
        <AddCategoryDialogBoxFields data={draft} setData={setDraft} />
        <DialogFooter className="bg-white">
            <DialogClose render={<Button variant="outline" className={"px-5 py-5"} >Cancel</Button>} />
            <DialogClose render={<Button type="submit" className={"px-5 py-5 aria-disabled:cursor-not-allowed"} onClick={handleCatSave} disabled={draft.data.name.trim() === ""}>Save Changes</Button>} />
        </DialogFooter>
    </DialogContent>)
}