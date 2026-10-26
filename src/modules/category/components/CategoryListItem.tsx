import { Check, ChevronDown, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
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

    // below md the icon is the select button. useMediaQuery because css can't decide whether a click should be stopped
    const isPhone = useMediaQuery("(max-width: 767px)");
    function handlePhoneIconClick(e: React.MouseEvent) {
        if (!isPhone) return;
        e.stopPropagation();
        setSelected((prev: string[]) => isChecked() ? prev.filter(id => id !== catObj.id) : [...prev, catObj.id]);
    }

    // the same badges are used twice: in the row (tablet and desktop),
    // and in a line inside the opened card (phone only)
    const pill = "max-md:rounded-full max-md:px-[9px]";
    const typeBadge = <Badge className={"bg-sky-soft text-exp-text " + pill}>{capitalize(catObj.type)}</Badge>;
    const statusBadge = catObj.status === "active" ?
        <Badge className={"bg-green-soft text-green " + pill}>Active</Badge> :
        <Badge className={"bg-coral-soft text-coral " + pill}>Archived</Badge>;
    const subsCount = <span className="flex gap-1 justify-center text-slate xl:text-[12px]"><span className="font-semibold xl:font-normal">{subCategoriesMap[catObj.id]?.length ?? 0}</span> subs</span>;

    // phone (below md): a slim card with icon, name, chevron and menu, the badges show up when it is opened
    // tablet (md to xl): one line, the columns are only as wide as they need
    // desktop (xl): the table row with one column per badge
    return (
        <AccordionItem value={catObj.id} className={cn("group/row relative mb-3 md:mb-0 bg-white rounded-[18px] border border-[#E6E9F4] overflow-hidden md:overflow-visible md:rounded-none md:border-0 md:border-b md:border-[#EEF0F7] xl:border-b-0 md:bg-transparent", isChecked() && "max-md:border-[#3347E0]")}>

            <AccordionTrigger className={cn("w-full grid grid-cols-[auto_1fr_auto_auto] md:grid-cols-[auto_auto_1fr_92px_64px_84px_32px] xl:grid-cols-[76px_36px_1fr_104px_80px_110px_40px] relative items-center min-h-14 md:min-h-0 py-2 pl-3 pr-1 md:py-3 md:px-3 xl:py-3 xl:pl-[34px] xl:pr-4 rounded-none md:rounded-lg gap-x-3 md:gap-x-3 xl:gap-x-3 cursor-pointer hover:bg-gray-100 text-center text-sm border-0 mb-0", catObj.status !== "active" && "opacity-60")} >
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

                {/* phone: tapping the icon selects the category (stopPropagation keeps the card from opening).
                    tablet and desktop have the checkbox, there the click goes through to the accordion as before */}
                <span className="relative flex" onClick={handlePhoneIconClick}>
                    <CategoryIcon name={catObj.icon} color={catObj.color} className={cn("max-md:size-[42px] max-md:rounded-[12px]", isChecked() && "max-md:ring-2 max-md:ring-[#3347E0] max-md:ring-offset-2")} iconClassName="max-md:size-5" />
                    {isChecked() &&
                        <span className="md:hidden absolute -right-1.5 -top-1.5 grid place-items-center size-[18px] rounded-full bg-[#3347E0] text-white border-2 border-white">
                            <Check size={10} strokeWidth={4} />
                        </span>
                    }
                </span>
                <h2 className="text-base md:text-[14px] text-left font-semibold xl:text-[14px]">{catObj.name}</h2>

                {/* the badges are the columns of the row (tablet and desktop), not on the phone */}
                <div className="hidden md:contents">
                    <span className="flex justify-center">{typeBadge}</span>
                    <span className="flex justify-center">{subsCount}</span>
                    <span className="flex justify-center">{statusBadge}</span>
                </div>

                <div className="flex items-center justify-center size-11 md:size-auto -ml-3 md:ml-0">
                    <CategoryMenuPopup isActive={catObj.status === "active"} categoryId={catObj.id} />
                </div>
            </ AccordionTrigger >
            <AccordionContent>
                {/* phone only */}
                <div className="md:hidden flex flex-wrap items-center gap-1.5 px-4 py-3 border-t border-[#EEF0F7] bg-[#FAFBFE]">
                    {typeBadge}
                    {statusBadge}
                    {subsCount}
                </div>
                <SubCategoryList subcategories={subCategoriesMap[catObj.id]} color={catObj.color} catId={catObj.id} />
            </AccordionContent>
        </AccordionItem>
    )
}
