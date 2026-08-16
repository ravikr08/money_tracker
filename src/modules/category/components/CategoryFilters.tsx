import DropdownMenuRadio from "@/shared/components/DropdownMenuRadio";
import TabMenu from "@/shared/components/TabMenu";
import type { InitFiltersValues, OriginFilterValues, StatusFilterValues, TypeFilterValues } from "../category.model";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { CATEGORY_TYPE_FILTER_OPTIONS, CATEGORY_ORIGIN_FILTER_OPTIONS, CATEGORY_STATUS_FILTER_OPTIONS, CATEGORY_DIALOG_HANDLE } from "../category.constants";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { useSelector } from "react-redux";
import { categoryServices } from "../category.services";
import type { Dispatch, SetStateAction } from "react";


export default function CategoryFilters({ selected, setSelected }: { selected: string[], setSelected: Dispatch<SetStateAction<string[]>> }) {
    const appliedFilters = useSelector((state) => state.categorySlice.filters);
    function setFilters(obj: Partial<InitFiltersValues>) {
        categoryServices.updateFilters(obj);
        setSelected([]);
    }
    function hanldeArchiveSelected() {
        if (selected.length) {
            categoryServices.archiveCategories(selected);
            setSelected([])
        }
    }
    function hanldeRestoreSelected() {
        if (selected.length) {
            categoryServices.restoreCategories(selected);
            setSelected([])
        }
    }

    return (
        <div className="w-full flex justify-between items-center">


            <div className="w-full flex gap-10 items-center justify-start">
                <DropdownMenuRadio options={CATEGORY_TYPE_FILTER_OPTIONS} selected={appliedFilters.type} onValChange={(value: TypeFilterValues) => { setFilters({ type: value }); }} />
                <DropdownMenuRadio options={CATEGORY_ORIGIN_FILTER_OPTIONS} selected={appliedFilters.origin} onValChange={(value: OriginFilterValues) => { setFilters({ origin: value }); }} />
                <TabMenu tabs={CATEGORY_STATUS_FILTER_OPTIONS} selectedTab={appliedFilters.status} onTabChange={(tab: StatusFilterValues) => { setFilters({ status: tab }); }} />
            </div>
            {selected?.length > 0 ?
                <div className="flex gap-5">
                    {(appliedFilters.status === "active" || appliedFilters.status === "all") ? <Button className={"bg-yellow-300 px-6 py-5 big cursor-pointer rounded-full hover:bg-yellow-500 font-bold flex gap-2 text-white items-center"} onClick={hanldeArchiveSelected}>Archive</Button> : <Button className={"bg-green-300 px-6 py-5 big cursor-pointer rounded-full hover:bg-green-500 font-bold flex gap-2 text-white items-center"} onClick={hanldeRestoreSelected}>Restore</Button>}
                    <Button className={"bg-red px-6 py-5 big cursor-pointer rounded-full hover:bg-red font-bold flex gap-2 text-white items-center"} disabled={true}>Delete</Button>
                </div>
                : <DialogTrigger render={<Button className={"bg-blue px-6 py-5 big cursor-pointer rounded-full hover:bg-blue-dark font-bold flex gap-2 text-white items-center"}><Plus strokeWidth="3" /> <span className="text-sm">New Category</span> </Button>} handle={CATEGORY_DIALOG_HANDLE} payload={{ mode: "create" }} />}
        </div>
    )
}