import SidebarList from "./SidebarList";
import SidebarRail from "./SidebarRail";
import SidebarLogo from "./SidebarLogo";
import { useLocation } from "react-router-dom";
import { pages } from "./sidebar.constants";

function SideBar(){
    const path = useLocation()

    return(
        <>
            {/* desktop, from lg (1024px) */}
            <aside className="hidden lg:flex w-60 shrink-0 flex-col gap-6 bg-white border-r border-[#E6E9F4] px-4 pt-5">
                <SidebarLogo className="w-[72px] h-9" />
                <ul className="flex flex-col w-full gap-1">
                    {pages.map(el=><SidebarList key={el.label} {...el} isActive={path.pathname === el.path}/>)}
                </ul>
            </aside>

            {/* tablet (768px - 1023px) */}
            <SidebarRail />
        </>
    )
}

export default SideBar;
