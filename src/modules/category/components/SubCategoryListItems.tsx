import { Badge } from "@/shared/components/ui/badge";
import { Archive, Lock, PenLine, RotateCcw, Trash } from "lucide-react";
import type { SubCategory } from "../category.model";
import { cn } from "@/shared/lib/utils";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";
import { categoryServices } from "../category.services";
import SubCategoryMenuPopup from "./SubCategoryMenuPopup";


export default function SubCategoryListItem({ subcat, color }: { subcat: SubCategory, color?: string }) {
    const subcatActive = subcat.status === "active";
    const subcatDefault = subcat.origin === "default";
    function handleSubcategoryArchive(){
        categoryServices.archiveSubcategories(subcat.id, subcat.categoryId)
    }
    function handleSubcategoryRestore(){
        categoryServices.restoreSubcategories(subcat.id, subcat.categoryId)
    }
    // phone (below md): dot, name, origin badge and a menu
    // tablet (md to xl): badges on a second line, the three icons on the right
    // desktop (xl): one column for everything
    return (
        <li className={cn("w-full min-h-[52px] md:min-h-0 py-1 pl-7 pr-1 md:py-2 md:px-5 grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_1fr_auto] xl:grid-cols-[30px_1fr_0.75fr_1fr_1fr_120px] gap-x-2.5 md:gap-x-3 md:gap-y-1 xl:gap-0 items-center border-b border-[#EEF0F7] md:border-b-0 md:border-l-2 md:border-gray-200", !subcatActive && "opacity-60 md:opacity-100")}>
            <span className="inline-block w-2 h-2 rounded-md md:row-span-2 xl:row-span-1" style={{ background: `${color}99` }}></span>
            <span className="font-medium md:font-semibold text-[15px] md:text-sm text-chart-3">{subcat.name}</span>
            <span className="hidden xl:block"></span>
            <div className="contents md:flex md:col-start-2 md:row-start-2 md:flex-wrap md:items-center md:gap-1.5 xl:contents">
                <span className="flex justify-center">
                    {subcatDefault ?
                        <Badge className={"bg-slate-soft text-slate flex gap-0.5 max-md:rounded-full max-md:px-[9px] max-md:items-center"}><Lock size={16} className="max-md:size-[11px]" />Default</Badge> :
                        <Badge className={"bg-slate-soft text-sky max-md:rounded-full max-md:px-[9px]"}>Custom</Badge>}
                </span>
                <span className="hidden md:flex justify-center">
                    {subcatActive ?
                        <Badge className={"bg-green-soft text-green"}>Active</Badge> :
                        <Badge className={"bg-coral-soft text-coral"}>Archived</Badge>}
                </span>
            </div>
            <span className="hidden md:flex gap-1.5 text-slate md:col-start-3 md:row-start-1 md:row-span-2 md:self-center xl:col-auto xl:row-auto xl:row-span-1">
                <span className="p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black">
                    {subcatDefault ? <Lock size={14} /> :
                        <DialogTrigger render={<PenLine size={14} />} handle={SUBCATEGORY_DIALOG_HANDLE} payload={{ mode: "edit", id: subcat.id, categoryId:subcat.categoryId }} />
                    }
                </span>
                <span className="p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black">
                    {subcatActive ? <Archive size={14} onClick={handleSubcategoryArchive}/> : <RotateCcw size={14} onClick={handleSubcategoryRestore}/>}
                </span>
                <span className={cn("p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black", !subcatDefault && "hover:text-red")}>
                    {subcatDefault ? <Lock size={14} /> : <Trash size={14} />}
                </span>
            </span>
            <div className="md:hidden">
                <SubCategoryMenuPopup subcat={subcat} />
            </div>
        </li>
    )
}
