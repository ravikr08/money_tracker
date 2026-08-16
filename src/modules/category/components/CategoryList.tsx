import Card from "@/shared/components/ui/Card"
import CategoryListItem from "./CategoryListItem"
import { Accordion } from "@/shared/components/ui/accordion"
import type { Category, InitFiltersValues } from "../category.model"
import { useSelector } from "react-redux"
import { type Dispatch, type SetStateAction } from "react";


function filterCategory(cat: Category, filters: InitFiltersValues) {
    return (filters.type === cat.type || filters.type === "all") && (filters.origin === cat.origin || filters.origin === "all") && (filters.status === cat.status || filters.status === "all");
}


export default function CategoryList({ selected, setSelected }: { selected: string[], setSelected: Dispatch<SetStateAction<string[]>>}) {
    const appliedFilters = useSelector(state => state.categorySlice.filters);
    const categories = useSelector(state => state.categorySlice.categories);

    const filteredCategoriesList = categories.filter((category: Category) => filterCategory(category, appliedFilters));

    function handleSelectAll(e){
        const selectedAll = e.target.checked;
        if(selectedAll){
            const selectedCatIds = filteredCategoriesList.map((cat:Category)=>cat.id)
            setSelected(selectedCatIds)
        }else{
            setSelected([])
        }
    }

    return (
        <Card className="w-full">
            {selected.length > 0 &&
                <div className="flex gap-2 items-center mb-3 ml-5">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" onChange={handleSelectAll} checked={selected.length === filteredCategoriesList.length}/>
                    <label >select all</label>
                </div>
            }
            {filteredCategoriesList.length > 0 ? <Accordion multiple>
                {filteredCategoriesList.map((category: Category) =>
                    <CategoryListItem catObj={category} key={category.id} selected={selected} setSelected={setSelected}/>
                )}
            </Accordion>:<div>
                <p className="text-xl text-coral text-center">Oops nothing to show here...</p>
            </div>
            }
        </Card>
    )
}