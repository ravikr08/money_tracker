import { ChevronDown, ChevronRight, Lock } from "lucide-react"
import type { Category } from "../category.model"
import { cn } from "@/shared/lib/utils";
import { capitalize } from "@/shared/utils/utils";
import CategoryMenuPopup from "./CategoryMenuPopup";
import { AccordionContent, AccordionTrigger, AccordionItem } from "@/shared/components/ui/accordion";
import { Badge } from "@/shared/components/ui/badge";
import SubCategoryList from "./SubCategoryList";
import CategoryIcon from "./CategoryIcon";
import { getColorShades } from "@/shared/utils/utils";
import { useSelector } from "react-redux";
import { type Dispatch, type SetStateAction } from "react";



export default function CategoryListItem({ catObj, selected, setSelected }: { catObj: Category, selected: string[], setSelected: Dispatch<SetStateAction<string[]>> }) {
    const subCategoriesMap = useSelector(state => state.categorySlice.subcategoriesMap);
    function handleCheckboxClick(e) {
        const checked = e.target.checked;
        if (checked) {
            setSelected((prev: string[]) => [...prev, catObj.id])
        } else {
            setSelected((prev: string[]) => prev.filter(id => catObj.id !== id))
        }
    }

    function isChecked(): boolean {
        return selected.some(id => id === catObj.id)
    }

    // the same badges are used twice: in the row (tablet and desktop),
    // and in a line inside the opened card (phone only)
    const pill = "max-md:rounded-full max-md:px-[9px]";
    const typeBadge = <Badge className={"bg-sky-soft text-exp-text " + pill}>{capitalize(catObj.type)}</Badge>;
    const originBadge = catObj.origin === "default" ?
        <Badge className={"bg-slate-soft text-slate flex gap-0.5 max-md:items-center " + pill}><Lock size={16} className="max-md:size-[11px]" />Default</Badge> :
        <Badge className={"bg-slate-soft text-sky " + pill}>Custom</Badge>;
    const statusBadge = catObj.status === "active" ?
        <Badge className={"bg-green-soft text-green " + pill}>Active</Badge> :
        <Badge className={"bg-coral-soft text-coral " + pill}>Archived</Badge>;
    const subsCount = <span className="flex gap-1 justify-center text-slate xl:text-[12px]"><span className="font-semibold xl:font-normal">{subCategoriesMap[catObj.id]?.length ?? 0}</span> subs</span>;

    // phone (below md): a slim card with icon, name, chevron and menu, the badges show up when it is opened
    // tablet (md to xl): one line, the columns are only as wide as they need
    // desktop (xl): the table row with one column per badge
    return (
        <AccordionItem value={catObj.id} className={"group/row relative mb-3 md:mb-0 bg-white rounded-[18px] border border-[#E6E9F4] overflow-hidden md:overflow-visible md:rounded-none md:border-0 md:border-b md:border-[#EEF0F7] xl:border-b-0 md:bg-transparent"}>

            <AccordionTrigger className={cn("w-full grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_auto_1fr_76px_88px_48px_66px_28px] xl:grid-cols-[76px_36px_1fr_104px_120px_80px_110px_40px] relative items-center min-h-14 md:min-h-0 py-2 pl-3 pr-1 md:py-3 md:px-3 xl:py-3 xl:pl-[34px] xl:pr-4 rounded-none md:rounded-lg gap-x-3 md:gap-x-2.5 xl:gap-x-3 cursor-pointer hover:bg-gray-100 text-center text-sm border-0 mb-0", catObj.status !== "active" && "opacity-60")} >
                {/* the coloured bar on the left of the row, desktop only */}
                <span className="hidden xl:block absolute left-3 top-1/2 -translate-y-1/2 h-[38px] w-1 rounded-full" style={{ background: getColorShades(catObj.color).ink }}></span>
                {/* checkbox is not on the phone, there only the chevron is kept and it moves to the right */}
                <div className="contents md:flex items-center gap-3 xl:gap-10">
                    <input type="checkbox" className="hidden md:block w-4 h-4 cursor-pointer" onClick={e => e.stopPropagation()} onChange={handleCheckboxClick} checked={isChecked()} />
                    <span className="col-start-3 row-start-1 self-center md:col-auto md:row-auto md:self-auto">
                        <ChevronDown size={18} className="md:hidden pointer-events-none shrink-0 text-[#586079] transition-transform group-aria-expanded/accordion-trigger:rotate-180" />
                        <span className="hidden md:inline">
                            <ChevronRight size={20} className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
                            <ChevronDown size={20} className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
                        </span>
                    </span>
                </div>

                <CategoryIcon name={catObj.icon} color={catObj.color} className="max-md:size-[42px] max-md:rounded-[12px]" iconClassName="max-md:size-5" />
                <h2 className="text-base md:text-[14px] text-left font-semibold xl:text-[14px]">{catObj.name}</h2>

                {/* the badges are the columns of the row (tablet and desktop), not on the phone */}
                <div className="hidden md:contents">
                    <span className="flex justify-center xl:justify-start">{typeBadge}</span>
                    <span className="flex justify-center xl:justify-start">{originBadge}</span>
                    <span className="flex justify-center xl:justify-start">{subsCount}</span>
                    <span className="flex justify-center xl:justify-start">{statusBadge}</span>
                </div>

                <div className="flex items-center justify-center size-11 md:size-auto -ml-3 md:ml-0">
                    <CategoryMenuPopup isActive={catObj.status === "active"} isDefault={catObj.origin === "default"} categoryId={catObj.id} />
                </div>
            </ AccordionTrigger >
            <AccordionContent>
                {/* phone only */}
                <div className="md:hidden flex flex-wrap items-center gap-1.5 px-4 py-3 border-t border-[#EEF0F7] bg-[#FAFBFE]">
                    {typeBadge}
                    {originBadge}
                    {statusBadge}
                    {subsCount}
                </div>
                <SubCategoryList subcategories={subCategoriesMap[catObj.id]} color={catObj.color} catId={catObj.id} />
            </AccordionContent>
        </AccordionItem>
    )
}
