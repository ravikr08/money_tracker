import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils";
import { pages } from "./sidebar.constants";
import SidebarLogo from "./SidebarLogo";

// tablet only (md to lg): a narrow bar with the icon and the label under it
export default function SidebarRail() {
    return (
        <aside className="hidden md:flex lg:hidden w-[92px] shrink-0 flex-col items-center gap-5 pt-4">
            <SidebarLogo className="w-14 h-10" />
            <nav aria-label="Main">
                <ul className="flex flex-col gap-1.5">
                    {pages.map(({ path, label, icon: Icon }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) => cn(
                                    "w-[84px] px-2 py-2.5 flex flex-col items-center gap-1 rounded-sm type-micro font-medium text-[#586079]",
                                    isActive && "bg-(--nav-active-bg) text-(--nav-active-fg) font-semibold"
                                )}
                            >
                                <Icon size={22} strokeWidth={1.8} />
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}
