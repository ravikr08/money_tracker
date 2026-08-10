import Card from "@/shared/components/ui/Card"
import CategoryListItem from "./CategoryListItem"
import { Accordion } from "@/shared/components/ui/accordion"
import type { Category, InitFiltersValues } from "../category.model"
import { useCategoryStore } from "../category.store"

function filterCategory(cat: Category, filters: InitFiltersValues) {
    return (filters.type === cat.type || filters.type === "all") && (filters.origin === cat.origin || filters.origin === "all") && (filters.status === cat.status || filters.status === "all");
}


export default function CategoryList() {
    const appliedFilters = useCategoryStore(state => state.filters);
    const categories = useCategoryStore((state) => state.categories);
    const filteredCategoriesList = categories.filter((category) => filterCategory(category, appliedFilters));
    return (
        <Card className="w-full">
            <Accordion multiple>
                {filteredCategoriesList.map((category) =>
                    <CategoryListItem {...category} key={category.id} />
                )}
            </Accordion>
        </Card>
    )
}