import Card from "@/shared/components/ui/Card"
import CategoryListItem from "./CategoryListItem"
import { Accordion } from "@/shared/components/ui/accordion"
import type { Category, InitFiltersValues } from "../category.model"
import { useSelector } from "react-redux"
import { Layers, Minus } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";

// texts of the three empty states, from the design. `hasAny` = there are categories, just none for this filter
function getEmptyContent(status: string, hasAny: boolean) {
    if (!hasAny) return { title: "No categories yet", text: "Add your first category to start organising your transactions.", showAll: false };
    if (status === "active") return { title: "No active categories", text: "Every category is archived right now. Restore one, or create a new category to start tracking.", showAll: true };
    if (status === "archived") return { title: "Nothing archived", text: "Categories you archive will be kept here, and you can restore them any time.", showAll: true };
    return { title: "No categories yet", text: "Add your first category to start organising your transactions.", showAll: false };
}

function CategoryEmptyState({ status, hasAny }: { status: string, hasAny: boolean }) {
    const { title, text, showAll } = getEmptyContent(status, hasAny);
    return (
        <div className="flex flex-col items-center py-12 md:py-16 px-6 text-center">
            {/* soft round glow with a dashed ring, the white tile on top and a small dark badge on its corner */}
            <div className="relative grid place-items-center size-[76px] rounded-full bg-[#E8ECFF] outline-1 outline-dashed outline-offset-4 outline-[#C9D2FF]">
                <span className="grid place-items-center size-[52px] rounded-[16px] bg-white text-[#3454F5] shadow-sm">
                    <Layers size={24} />
                </span>
                <span className="absolute right-0 bottom-1 grid place-items-center size-[18px] rounded-full bg-[#0B1020] text-white">
                    <Minus size={10} strokeWidth={3} />
                </span>
            </div>
            <h3 className="mt-5 text-[15px] font-bold text-[#0B1020]">{title}</h3>
            <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-slate">{text}</p>
            {showAll &&
                // inert for now, the filter is yours: categoryServices.updateFilters({ status: "all" })
                <button type="button" className="mt-4 px-4 py-2 rounded-full border border-[#D9DEF0] text-xs font-semibold text-[#0B1020] hover:bg-slate-soft cursor-pointer">
                    Show all categories
                </button>
            }
        </div>
    )
}


function filterCategory(cat: Category, filters: InitFiltersValues) {
    return (filters.type === cat.type || filters.type === "all") && (filters.status === cat.status || filters.status === "all") && cat.status !== "deleted";
}


export default function CategoryList({ selected, setSelected }: { selected: string[], setSelected: Dispatch<SetStateAction<string[]>> }) {
    const appliedFilters = useSelector(state => state.categorySlice.filters);
    const categories = useSelector(state => state.categorySlice.categories);

    const filteredCategoriesList = categories.filter((category: Category) => filterCategory(category, appliedFilters));

    const allSelected = filteredCategoriesList.length > 0 && selected.length === filteredCategoriesList.length;

    function handleSelectAll(e) {
        const selectedAll = e.target.checked;
        if (selectedAll) {
            const selectedCatIds = filteredCategoriesList.map((cat: Category) => cat.id)
            setSelected(selectedCatIds)
        } else {
            setSelected([])
        }
    }

    return (
        <Card className="w-full p-0 bg-transparent md:bg-white md:p-3 lg:p-5 md:rounded-3xl xl:p-0 xl:pt-4 xl:pb-3 xl:rounded-[20px]">
            {/* header of the table, desktop only. same columns as the rows (see CategoryListItem) */}
            {filteredCategoriesList.length > 0 &&
                <div className="hidden xl:grid grid-cols-[76px_36px_1fr_104px_80px_110px_40px] items-center gap-x-3 mx-3 pl-[22px] pr-1 pb-3 mb-1 border-b border-[#EEF0F7] text-[12px] font-semibold text-ink-soft">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" aria-label="Select all" onChange={handleSelectAll} checked={allSelected} ref={el => { if (el) el.indeterminate = selected.length > 0 && !allSelected }} />
                    <span></span>
                    <span>Name</span>
                    <span className="text-center">Type</span>
                    <span className="text-center">Subs</span>
                    <span className="text-center">Status</span>
                    <span></span>
                </div>
            }
            {selected.length > 0 &&
                <div className="xl:hidden flex gap-2 items-center mb-3 ml-5">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" onChange={handleSelectAll} checked={selected.length === filteredCategoriesList.length} />
                    <label >select all</label>
                </div>
            }
            {filteredCategoriesList.length > 0 ? <Accordion multiple>
                {filteredCategoriesList.map((category: Category) =>
                    category.status === "deleted" ? null : <CategoryListItem catObj={category} key={category.id} selected={selected} setSelected={setSelected} />
                )}
            </Accordion> : <CategoryEmptyState status={appliedFilters.status} hasAny={categories.some((cat: Category) => cat.status !== "deleted")} />
            }
        </Card>
    )
}