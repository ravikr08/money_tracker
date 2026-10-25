import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { Archive, Ellipsis, PenLine, RotateCcw } from "lucide-react";
import type { SubCategory } from "../category.model";
import { SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";
import { categoryServices } from "../category.services";

// the actions of one subcategory in a menu, used below xl where the three icons don't fit
export default function SubCategoryMenuPopup({ subcat }: { subcat: SubCategory }) {
    const isActive = subcat.status === "active";
    const isDefault = subcat.origin === "default";

    function handleStatusChange() {
        if (isActive) {
            categoryServices.archiveSubcategories(subcat.id, subcat.categoryId);
        } else {
            categoryServices.restoreSubcategories(subcat.id, subcat.categoryId);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<button aria-label={"More options for " + subcat.name} className="size-11 grid place-items-center rounded-full text-[#586079] cursor-pointer"><Ellipsis size={20} /></button>} />
            <DropdownMenuContent className="w-fit p-1.5 bg-white flex flex-col rounded-sm ring-0">
                {/* default subcategories can't be edited */}
                {!isDefault && (
                    <DropdownMenuItem className={"p-0"}>
                        <DialogTrigger handle={SUBCATEGORY_DIALOG_HANDLE} payload={{ mode: "edit", id: subcat.id, categoryId: subcat.categoryId }} className={"flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-blue-soft rounded-[7px] w-full"}>
                            <PenLine size={16} /> Edit
                        </DialogTrigger>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem className={"p-0"} onClick={handleStatusChange}>
                    <span className="flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-blue-soft rounded-[7px] w-full">
                        {isActive ? <><Archive size={16} /> Archive</> : <><RotateCcw size={16} /> Restore</>}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
