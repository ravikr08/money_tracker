import Card from "@/shared/components/ui/Card"
import CategoryListItem from "./CategoryListItem"
import { Accordion } from "@/shared/components/ui/accordion"
import type { Category, InitFiltersValues } from "../category.model"
import { useSelector } from "react-redux"
import { type Dispatch, type SetStateAction } from "react";


function filterCategory(cat: Category, filters: InitFiltersValues) {
    return (filters.type === cat.type || filters.type === "all") && (filters.origin === cat.origin || filters.origin === "all") && (filters.status === cat.status || filters.status === "all");
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
                <div className="hidden xl:grid grid-cols-[76px_36px_1fr_104px_120px_80px_110px_40px] items-center gap-x-3 mx-3 pl-[22px] pr-4 pb-3 mb-1 border-b border-[#EEF0F7] text-[12px] font-semibold text-ink-soft">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" aria-label="Select all" onChange={handleSelectAll} checked={allSelected} ref={el => { if (el) el.indeterminate = selected.length > 0 && !allSelected }} />
                    <span></span>
                    <span>Name</span>
                    <span>Type</span>
                    <span>Origin</span>
                    <span>Subs</span>
                    <span>Status</span>
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
                    <CategoryListItem catObj={category} key={category.id} selected={selected} setSelected={setSelected} />
                )}
            </Accordion> : <div>
                <p className="text-xl text-coral text-center">Oops nothing to show here...</p>
            </div>
            }
        </Card>
    )
}