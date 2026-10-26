import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { PenLine, Plus, Archive, Lock, Trash, Ellipsis, RotateCcw, type LucideIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { CATEGORY_DIALOG_HANDLE, SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";
import { categoryServices } from "../category.services";

// look of a row, the same for every row of the menu
const rowClass = "flex items-center gap-4 px-2.5 py-2 cursor-pointer rounded-[6px]";
// the grey "Default - can't be deleted" row
const lockedClass = "text-slate focus:bg-white focus:**:text-slate! cursor-default rounded-[6px]";

function RowContent({ icon: Icon, text, locked }: { icon: LucideIcon, text: string, locked?: boolean }) {
    return (
        <>
            <Icon size={16} />
            <p className={cn(locked && "text-slate focus:text-red-200")}>{text}</p>
        </>
    )
}

// a row that does something when it is clicked. the menu is inside the accordion row,
// so the click is stopped here or it would also open or close the row
function MenuItem({ icon, text, variant, locked, onClick }: { icon: LucideIcon, text: string, variant?: "default" | "destructive", locked?: boolean, onClick?: () => void }) {
    return (
        <DropdownMenuItem
            variant={variant}
            className={cn(rowClass, locked && lockedClass)}
            onClick={e => { e.stopPropagation(); onClick?.() }}
        >
            <RowContent icon={icon} text={text} locked={locked} />
        </DropdownMenuItem>
    )
}

type CategoryMenuPopupProps = { isActive: boolean, categoryId: string }

export default function CategoryMenuPopup({ isActive, categoryId }: CategoryMenuPopupProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<button className="opacity-50 hover:opacity-100"><Ellipsis size={20} /></button>} onClick={e => { e.stopPropagation() }} />
            <DropdownMenuContent className="w-50 p-2.5 bg-white flex flex-col gap-3 rounded-md ring-0" >
                {/* the two dialog rows: the trigger sits inside the item and fills it (p-0 on the item, w-full on the trigger) */}
                <DropdownMenuItem className={cn(rowClass, "w-full p-0")} onClick={e => e.stopPropagation()}>
                    <DialogTrigger handle={CATEGORY_DIALOG_HANDLE} payload={{ mode: "edit", id: categoryId }} className={cn(rowClass, "w-full")}>
                        <RowContent icon={PenLine} text="Edit Category" />
                    </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem className={cn(rowClass, "w-full p-0")} onClick={e => e.stopPropagation()}>
                    <DialogTrigger handle={SUBCATEGORY_DIALOG_HANDLE} payload={{ mode: "create", categoryId }} className={cn(rowClass, "w-full")}>
                        <RowContent icon={Plus} text="Add Subcategory" />
                    </DialogTrigger>
                </DropdownMenuItem>

                {isActive
                    ? <MenuItem icon={Archive} text="Archive" onClick={() => categoryServices.archiveCategories([categoryId])} />
                    : <MenuItem icon={RotateCcw} text="Restore" onClick={() => categoryServices.restoreCategories([categoryId])} />
                }

                <MenuItem icon={Trash} text="Delete" variant="destructive" onClick={() => categoryServices.deleteCategories([categoryId])} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
