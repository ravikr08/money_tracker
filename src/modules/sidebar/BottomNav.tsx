import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { pages } from "./sidebar.constants";

// phone only (below md)
export default function BottomNav() {
    return (
        <nav aria-label="Main" className="md:hidden shrink-0 flex gap-0.5 px-2 pt-2 pb-2 bg-white border-t border-[#E6E9F4]">
            {pages.map(({ path, label, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => cn(
                        "min-h-14 min-w-0 flex-1 px-1 flex flex-col items-center justify-center gap-1 rounded-sm type-micro font-medium text-[#586079]",
                        isActive && "flex-[1.4] px-[3px] bg-(--nav-active-bg) text-(--nav-active-fg) font-semibold"
                    )}
                >
                    {({ isActive }) => (
                        <>
                            <Icon size={22} strokeWidth={1.8} />
                            <span className={isActive ? undefined : "sr-only"}>{label}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    )
}
