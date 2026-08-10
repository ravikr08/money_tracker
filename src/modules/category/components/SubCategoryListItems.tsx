import { Badge } from "@/shared/components/ui/badge";
import { Archive, Lock, PenLine, RotateCcw, Trash } from "lucide-react";
import type { SubCategory } from "../category.model";
import { cn } from "@/shared/lib/utils";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { CATEGORY_DIALOG_HANDLE } from "../category.contansts";


export default function SubCategoryListItem({ subcat, color }: { subcat: SubCategory, color?: string }) {
    const subcatActive = subcat.status === "active";
    const subcatDefault = subcat.origin === "default";
    return (
        <li className="w-full py-2 px-5 grid grid-cols-[30px_1fr_1fr_1fr_120px] items-center border-l-1 border-ink-soft">
            <span className="inline-block w-2 h-2 rounded-md" style={{ background: `${color}99` }}></span>
            <span className="font-semibold text-chart-3">{subcat.name}</span>
            <span className="flex justify-center">
                {subcatDefault ?
                    <Badge className={"bg-slate-soft text-slate flex gap-0.5"}><Lock size={16} />Default</Badge> :
                    <Badge className={"bg-slate-soft text-sky"}>Custom</Badge>}
            </span>
            <span className="flex justify-center">
                {subcatActive ?
                    <Badge className={"bg-green-soft text-green"}>Active</Badge> :
                    <Badge className={"bg-coral-soft text-coral"}>Archived</Badge>}
            </span>
            <span className="flex gap-1.5 text-slate">
                <span className="p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black">
                    {subcatDefault ? <Lock size={14} /> :
                        <DialogTrigger render={<PenLine size={14} />} handle={CATEGORY_DIALOG_HANDLE} payload={{ mode: "edit", type: "subcategory", data: { ...subcat } }} />
                    }
                </span>
                <span className="p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black">
                    {subcatActive ? <Archive size={14} /> : <RotateCcw size={14} />}
                </span>
                <span className={cn("p-2 rounded-[7px] hover:bg-slate-soft hover:cursor-pointer hover:text-black", !subcatDefault && "hover:text-red")}>
                    {subcatDefault ? <Lock size={14} /> : <Trash size={14} />}
                </span>
            </span>
        </li>
    )
}