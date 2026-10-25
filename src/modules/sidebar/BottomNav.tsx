import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { pages } from "./sidebar.constants";

// phone only (below md). settings is not in the design, it opens from the avatar in the header
const bottomPages = pages.filter(page => page.path !== "/settings");

export default function BottomNav() {
    return (
        <nav aria-label="Main" className="md:hidden shrink-0 grid grid-cols-5 gap-0.5 px-2 pt-2 pb-3.5 bg-white border-t border-[#E6E9F4]">
            {bottomPages.map(({ path, label, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    className={({ isActive }) => cn(
                        "min-h-14 flex flex-col items-center justify-center gap-[3px] rounded-[14px] text-[11px] font-medium text-[#586079]",
                        isActive && "bg-(--nav-active-bg) text-(--nav-active-fg) font-semibold"
                    )}
                >
                    <Icon size={22} strokeWidth={1.8} />
                    {label}
                </NavLink>
            ))}
        </nav>
    )
}
