import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { Archive, Ellipsis, PenLine, RotateCcw, Trash2, type LucideIcon } from "lucide-react";
import type { SubCategory } from "../category.model";
import { SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";
import { categoryServices } from "../category.services";

// look of a row. it fills the whole menu item (the item has p-0), so the whole row can be clicked, not only the icon
const rowClass = "flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-blue-soft rounded-[7px] w-full";

function RowContent({ icon: Icon, text }: { icon: LucideIcon, text: string }) {
    return (
        <>
            <Icon size={16} /> {text}
        </>
    )
}

// a row that does something when it is clicked
function MenuItem({ icon, text, onClick }: { icon: LucideIcon, text: string, onClick: () => void }) {
    return (
        <DropdownMenuItem className="p-0" onClick={onClick}>
            <span className={rowClass}>
                <RowContent icon={icon} text={text} />
            </span>
        </DropdownMenuItem>
    )
}

// the actions of one subcategory in a menu, used below md where the three icons don't fit
export default function SubCategoryMenuPopup({ subcat }: { subcat: SubCategory }) {
    const isActive = subcat.status === "active";

    function handleStatusChange() {
        if (isActive) {
            categoryServices.archiveSubcategory(subcat.id, subcat.categoryId);
        } else {
            categoryServices.restoreSubcategory(subcat.id, subcat.categoryId);
        }
    }
    function handleDelete() {
        categoryServices.deleteSubcategory(subcat.id, subcat.categoryId);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<button aria-label={"More options for " + subcat.name} className="size-11 grid place-items-center rounded-full text-[#586079] cursor-pointer"><Ellipsis size={20} /></button>} />
            <DropdownMenuContent className="w-fit p-1.5 bg-white flex flex-col rounded-sm ring-0">
                {/* the trigger sits inside the item and fills it */}
                <DropdownMenuItem className="p-0">
                    <DialogTrigger handle={SUBCATEGORY_DIALOG_HANDLE} payload={{ mode: "edit", id: subcat.id, categoryId: subcat.categoryId }} className={rowClass}>
                        <RowContent icon={PenLine} text="Edit" />
                    </DialogTrigger>
                </DropdownMenuItem>

                <MenuItem icon={isActive ? Archive : RotateCcw} text={isActive ? "Archive" : "Restore"} onClick={handleStatusChange} />

                {/* still calls the archive / restore function, delete is not written yet */}
                <MenuItem icon={Trash2} text="Delete" onClick={handleDelete} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
