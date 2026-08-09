import type { ReactNode } from "react"
import { cn } from "@/shared/lib/utils"

type colorWrapProps = {
    children: ReactNode;
    className?: string;
}

function Badge({ children, className = "" }: colorWrapProps) {
    return (<span className={cn("w-fit px-3 py-1 font-semibold rounded-md flex gap-0.5 text-[12px]", className)}>{children}</span>)
}

export { Badge }
