import { ChevronDown, ChevronRight, Lock } from "lucide-react"
import type { Category } from "../category.model"
import { cn } from "@/shared/lib/utils";
import { capitalize } from "@/shared/utils/utils";
import CategoryMenuPopup from "./CategoryMenuPopup";
import { AccordionContent, AccordionTrigger, AccordionItem } from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import SubCategoryList from "./SubCategoryList";
import { useCategoryStore } from "../category.store";



export default function CategoryListItemOld(catObj: Category) {
    const subCategoriesMap = useCategoryStore(state => state.subCategoriesMap);
    function handleCheckboxClick(e) {
        e.stopPropagation();
    }

    return (
        <AccordionItem value={catObj.id} className={"relative"}>

            <AccordionTrigger className={cn("w-full grid grid-cols-[60px_50px_2.2fr_.8fr_1.1fr_155px_100px_40px] relative items-center p-4 rounded-lg my-2 gap-5 cursor-pointer hover:bg-gray-100 text-center text-sm border-l-4 border-blue-300", catObj.status !== "active" && "opacity-60")} style={{ borderColor: `${catObj.color}B3` }} >
                <div className="flex items-center gap-5">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" onClick={handleCheckboxClick} />
                    <span>
                        <ChevronRight size={20} className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
                        <ChevronDown size={20} className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
                    </span>
                </div>

                <span className="p-2 rounded-md text-[16px] w-fit" style={{ background: `${catObj.color}33` }}>{catObj.icon}</span>
                <h2 className="text-[14px] text-left font-semibold">{catObj.name}</h2>

                <span className="basis-25 flex justify-center">
                    <Badge className={"bg-sky-soft text-exp-text"}>{capitalize(catObj.type)}</Badge>
                </span>

                <span className="basis-25 flex justify-center">
                    {catObj.origin === "default" ?
                        <Badge className={"bg-slate-soft text-slate flex gap-0.5"}><Lock size={16} />Default</Badge> :
                        <Badge className={"bg-slate-soft text-sky"}>Custom</Badge>}
                </span>

                <span className="basis-35 flex gap-1 justify-center text-slate"><span className="font-semibold">{subCategoriesMap[catObj.id]?.length ?? 0}</span> subs</span>

                <span className="basis-35 flex justify-center">
                    {catObj.status === "active" ?
                        <Badge className={"bg-green-soft text-green"}>Active</Badge> :
                        <Badge className={"bg-coral-soft text-coral"}>Archived</Badge>}
                </span>

                <CategoryMenuPopup isDefault={catObj.origin === "default"} data={catObj} />
            </ AccordionTrigger >
            <AccordionContent>
                <SubCategoryList subcategories={subCategoriesMap[catObj.id]} color={catObj.color} catId={catObj.id} />
            </AccordionContent>
        </AccordionItem>
    )
}