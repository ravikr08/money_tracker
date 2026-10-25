import { CircleHelp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CATEGORY_ICONS } from "../category.icons";
import { getColorShades } from "@/shared/utils/utils";

// the icon of a category on its coloured tile. an unknown key shows a question mark
export default function CategoryIcon({ name, color, className, iconClassName }: { name: string, color: string, className?: string, iconClassName?: string }) {
    const Icon = CATEGORY_ICONS[name] ?? CircleHelp;
    const { soft, ink } = getColorShades(color);
    return (
        <span className={cn("grid place-items-center shrink-0 size-9 rounded-[10px]", className)} style={{ background: soft, color: ink }}>
            <Icon className={cn("size-[18px]", iconClassName)} strokeWidth={1.8} />
        </span>
    )
}
