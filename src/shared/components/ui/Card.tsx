import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

type CardProps = {
    className?: string;
    children : ReactNode;
}
function Card({className, children}: CardProps){
    return <div className={cn("rounded-lg p-5 bg-white w-fit", className)}>{children}</div>;
}

export default Card;