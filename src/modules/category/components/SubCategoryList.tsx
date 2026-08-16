import { DialogTrigger } from "@/shared/components/ui/dialog";
import type { SubCategory } from "../category.model";
import SubCategoryListItem from "./SubCategoryListItems";
import { SUBCATEGORY_DIALOG_HANDLE } from "../category.constants";


export default function SubCategoryList({ subcategories, color, catId }: { subcategories: SubCategory[], color: string, catId: string }) {
    return (
        <div className="w-full flex flex-col items-end">
            <ul className="w-9/10 flex flex-col items-start">
                {subcategories && subcategories.map(subcat => (
                    <SubCategoryListItem key={subcat.id} subcat={subcat} color={color} />
                ))}
                <li className="mt-3 ml-2">
                    <DialogTrigger render={<button className="text-blue font-semibold cursor-pointer">+ Add subcategory</button>} handle={SUBCATEGORY_DIALOG_HANDLE} payload={{ mode: "create", categoryId: catId }} />

                </li>
            </ul>
        </div>
    )
}