import { cn } from "@/shared/lib/utils";

// placeholder for the logo, used by the sidebar and the tablet rail
export default function SidebarLogo({ className }: { className?: string }) {
    return (
        <div className={cn("grid place-items-center rounded-lg border border-dashed border-gray-300 type-body text-gray-500", className)}>logo</div>
    )
}
