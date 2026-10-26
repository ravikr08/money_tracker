import Card from "@/shared/components/ui/Card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// on the phone only the first card (isMain) is wide and has an icon
export default function AccountsSummaryCard({title,icon:Icon,value,desc,isMain,className}:{title:string, icon:LucideIcon, value:string, desc:string, isMain?:boolean, className?:string}){
    return(
        <Card className={cn("w-full flex flex-col gap-2.5 max-md:rounded-[20px] max-md:gap-1.5", className)}>
           <>
           <div className="w-full flex items-center justify-between">
                <h3 className="type-body font-semibold text-slate max-md:font-normal">{title}</h3>
                <span className={cn("inline-block p-1.5 bg-[#EEF0F9] rounded-sm text-slate max-md:rounded-full max-md:p-2.5", !isMain && "max-md:hidden")}><Icon size={18} strokeWidth={1.8} /></span>
           </div>
           <h1 className={cn("font-bold break-all", isMain ? "type-display" : "type-stat")}>{value}</h1>
           <p className="type-label text-slate">{desc}</p>
           </>
        </Card>
    )
}
