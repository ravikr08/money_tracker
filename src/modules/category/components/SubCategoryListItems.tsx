import { Badge } from "@/shared/components/ui/badge";
import { Archive, PenLine, RotateCcw, Trash, Trash2 } from "lucide-react";
import type { SubCategory } from "../category.model";
import { cn } from "@/shared/lib/utils";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";
import { categoryServices } from "../category.services";
import SubCategoryMenuPopup from "./SubCategoryMenuPopup";


export default function SubCategoryListItem({ subcat, color }: { subcat: SubCategory, color?: string }) {
    const subcatActive = subcat.status === "active";
    function handleSubcategoryArchive() {
        categoryServices.archiveSubcategory(subcat.id, subcat.categoryId)
    }
    function handleSubcategoryRestore() {
        categoryServices.restoreSubcategory(subcat.id, subcat.categoryId)
    }
    function handleDelete() {
        categoryServices.deleteSubcategory(subcat.id, subcat.categoryId);
    }
    // phone (below md): dot, name and a menu
    // tablet (md to xl): the status badge on a second line, the three icons on the right
    // desktop (xl): one column for everything
    return (
        <li className={cn("w-full min-h-[52px] md:min-h-0 py-1 pl-7 pr-1 md:py-2 md:px-5 grid grid-cols-[auto_1fr_auto] xl:grid-cols-[30px_1fr_0.75fr_1fr_120px] gap-x-2.5 md:gap-x-3 md:gap-y-1 xl:gap-0 items-center border-b border-[#EEF0F7] md:border-b-0 md:border-l-2 md:border-gray-200", !subcatActive && "opacity-60 md:opacity-100")}>
            <span className="inline-block w-2 h-2 rounded-md md:row-span-2 xl:row-span-1" style={{ background: `${color}99` }}></span>
            <span className="font-medium md:font-semibold text-[15px] md:text-sm text-chart-3">{subcat.name}</span>
            <span className="hidden xl:block"></span>
            <div className="contents md:flex md:col-start-2 md:row-start-2 md:flex-wrap md:items-center md:gap-1.5 xl:contents">
                <span className="hidden md:flex justify-center">
                    {subcatActive ?
                        <Badge className={"bg-green-soft text-green"}>Active</Badge> :
                        <Badge className={"bg-coral-soft text-coral"}>Archived</Badge>}
                </span>
            </div>
            <span className="hidden md:flex gap-1.5 text-slate md:col-start-3 md:row-start-1 md:row-span-2 md:self-center xl:col-auto xl:row-auto xl:row-span-1">
                {/* the padding is on the button itself, so the whole box is clickable, not only the icon */}
                <DialogTrigger handle={SUBCATEGORY_DIALOG_HANDLE} payload={{ mode: "edit", id: subcat.id, categoryId: subcat.categoryId }} className="p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black">
                    <PenLine size={14} />
                </DialogTrigger>
                <button type="button" onClick={subcatActive ? handleSubcategoryArchive : handleSubcategoryRestore} className="p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black">
                    {subcatActive ? <Archive size={14} /> : <RotateCcw size={14} />}
                </button>
                <span className={cn("p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black", "hover:text-red hover:bg-red-soft")} onClick={handleDelete}>
                    {<Trash2 size={14} />}
                </span>
            </span>
            <div className="md:hidden">
                <SubCategoryMenuPopup subcat={subcat} />
            </div>
        </li>
    )
}
