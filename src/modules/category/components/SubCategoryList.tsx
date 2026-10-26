import { DialogTrigger } from "@/shared/components/ui/dialog";
import type { SubCategory } from "../category.model";
import SubCategoryListItem from "./SubCategoryListItems";
import { SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";


export default function SubCategoryList({ subcategories, color, catId }: { subcategories: SubCategory[], color: string, catId: string }) {
    return (
        <div className="w-full flex flex-col items-end">
            <ul className="w-full md:w-9/10 flex flex-col items-start border-t border-[#EEF0F7] bg-[#FAFBFE] md:border-t-0 md:bg-transparent">
                {subcategories && subcategories.map(subcat => {
                    if (subcat.status === "deleted") {
                        return null;
                    }
                    return <SubCategoryListItem key={subcat.id} subcat={subcat} color={color} />
                })}
                <li className="mt-0 md:mt-3 ml-0 md:ml-2 pl-7 md:pl-0 min-h-12 md:min-h-0 flex items-center">
                    <DialogTrigger render={<button className="text-blue font-semibold cursor-pointer">+ Add subcategory</button>} handle={SUBCATEGORY_DIALOG_HANDLE} payload={{ mode: "create", categoryId: catId }} />

                </li>
            </ul>
        </div>
    )
}
