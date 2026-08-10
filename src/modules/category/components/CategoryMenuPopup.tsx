import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { PenLine, Plus, Archive, Lock, Trash, Ellipsis, type LucideIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { CATEGORY_DIALOG_HANDLE, createInitalSubCategory } from "../category.contansts";
import type { Category } from "../category.model";
type MenuItemsType = {
    id: string,
    icon: LucideIcon,
    text: string,
    variant?: "default" | "destructive",
    visibleFor: "all" | "default" | "custom";
};
const menuItems: MenuItemsType[] = [
    {
        id: "CMP_MI_001",
        icon: PenLine,
        text: "Edit Category",
        visibleFor: "all"
    },
    {
        id: "CMP_MI_002",
        icon: Plus,
        text: "Add Subcategory",
        visibleFor: "all"
    }, {
        id: "CMP_MI_003",
        icon: Archive,
        text: "Archive",
        visibleFor: "all"
    },
    {
        id: "CMP_MI_004",
        icon: Trash,
        text: "Delete",
        variant: "destructive",
        visibleFor: "custom"
    },
    {
        id: "CMP_MI_005",
        icon: Lock,
        text: "Default - can't be deleted",
        visibleFor: "default"
    }
]
export default function CategoryMenuPopup({ isDefault, data }: { isDefault: boolean, data: Category }) {
    const visibleMenuItems = menuItems.filter((el) => {
        return el.visibleFor === "all" || (isDefault ? el.visibleFor === "default" : el.visibleFor === "custom");
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<button className="opacity-50 hover:opacity-100"><Ellipsis size={20} /></button>} onClick={e => { e.stopPropagation() }} />
            <DropdownMenuContent className="w-50 p-2.5 bg-white flex flex-col gap-3 rounded-md ring-0" >
                {
                    visibleMenuItems.map(item => getDropDownMenuItem(item, data))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function getDropDownMenuItem(item: MenuItemsType, data: Category) {
    if (item.id === "CMP_MI_001") {//edit category
        return <DialogTrigger key={item.id} render={<DropdownMenuItem className={cn("flex items-center gap-4 px-2.5 py-2 cursor-pointer", item.visibleFor === "default" && "text-slate focus:bg-white focus:**:text-slate! cursor-default")} variant={item.variant} onClick={e => e.stopPropagation()} key={item.id}>
            <item.icon size={16} />
            <p className={cn(item.visibleFor === "default" && "text-slate focus:text-red-200")}>{item.text}</p>
        </DropdownMenuItem>} handle={CATEGORY_DIALOG_HANDLE} payload={{ mode: "edit", type: "category", data: { ...data } }} />
    }
    else if (item.id === "CMP_MI_002") {// add sub-category
        return <DialogTrigger key={item.id} render={<DropdownMenuItem className={cn("flex items-center gap-4 px-2.5 py-2 cursor-pointer", item.visibleFor === "default" && "text-slate focus:bg-white focus:**:text-slate! cursor-default")} variant={item.variant} onClick={e => e.stopPropagation()} key={item.id}>
            <item.icon size={16} />
            <p className={cn(item.visibleFor === "default" && "text-slate focus:text-red-200")}>{item.text}</p>
        </DropdownMenuItem>} handle={CATEGORY_DIALOG_HANDLE} payload={{ mode: "create", type: "subcategory", data: { ...createInitalSubCategory(), categoryId: data.id } }} />
    }
    else {
        return <DropdownMenuItem className={cn("flex items-center gap-4 px-2.5 py-2 cursor-pointer", item.visibleFor === "default" && "text-slate focus:bg-white focus:**:text-slate! cursor-default")} variant={item.variant} onClick={e => e.stopPropagation()} key={item.id}>
            <item.icon size={16} />
            <p className={cn(item.visibleFor === "default" && "text-slate focus:text-red-200")}>{item.text}</p>
        </DropdownMenuItem>
    }
}