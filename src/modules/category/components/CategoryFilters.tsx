import DropdownMenuRadio from "@/shared/components/DropdownMenuRadio";
import TabMenu from "@/shared/components/TabMenu";
import type { OriginFilterValues, StatusFilterValues, TypeFilterValues } from "../category.model";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { CATEGORY_TYPE_FILTER_OPTIONS, CATEGORY_ORIGIN_FILTER_OPTIONS, CATEGORY_STATUS_FILTER_OPTIONS, CATEGORY_DIALOG_HANDLE, createInitalCategory } from "../category.contansts";
import { useCategoryStore } from "../category.store";
import { DialogTrigger } from "@/shared/components/ui/dialog";


export default function CategoryFilters() {
    const appliedFilters = useCategoryStore(state => state.filters);
    const setFilters = useCategoryStore(state => state.setFilters);
    const newCategory = createInitalCategory()
    return (
        <div className="w-full flex justify-between items-center">


            <div className="w-full flex gap-10 items-center justify-start">
                <DropdownMenuRadio options={CATEGORY_TYPE_FILTER_OPTIONS} selected={appliedFilters.type} onValChange={(value: TypeFilterValues) => { setFilters({ type: value }); }} />
                <DropdownMenuRadio options={CATEGORY_ORIGIN_FILTER_OPTIONS} selected={appliedFilters.origin} onValChange={(value: OriginFilterValues) => { setFilters({ origin: value }); }} />
                <TabMenu tabs={CATEGORY_STATUS_FILTER_OPTIONS} selectedTab={appliedFilters.status} onTabChange={(tab: StatusFilterValues) => { setFilters({ status: tab }); }} />
            </div>
            <DialogTrigger render={<Button className={"bg-blue px-6 py-5 big cursor-pointer rounded-full hover:bg-blue-dark font-bold flex gap-2 text-white items-center"}><Plus strokeWidth="3" /> <span className="text-sm">New Category</span> </Button>} handle={CATEGORY_DIALOG_HANDLE} payload={{ mode: "create", type: "category", data: newCategory }} />
        </div>
    )
}