import SidebarList from "./SidebarList";
import { LayoutDashboard, ArrowLeftRight, Wallet, ChartNoAxesCombined, Settings, Layers } from "lucide-react";
import type { LucideIcon } from 'lucide-react'
import { useLocation } from "react-router-dom";


export type Page = {
    path : string,
    icon : LucideIcon;
    label : string;
}
function SideBar(){
    const path = useLocation()
    const pages: Page[] = [
        {
            "path": "/",
            "label":"Dashboard",
            "icon" : LayoutDashboard,
        },{
            "path": "/transactions",
            "label":"Transactions",
            "icon" : ArrowLeftRight,
        },{
            "path": "/accounts",
            "label":"Accounts",
            "icon" : Wallet,
        },{
            "path": "/analytics",
            "label":"Analytics",
            "icon" : ChartNoAxesCombined,
        },{
            "path": "/category",
            "label": "Category",
            "icon": Layers
        }, {
            "path": "/settings",
            "label":"Settings",
            "icon" : Settings,
        }];

    return(
        <aside className="w-70 flex flex-col pr-2 ">
            <div className="relative">logo</div>
            <ul className="flex flex-col w-full gap-1">
                {pages.map(el=><SidebarList key={el.label} {...el} isActive={path.pathname === el.path}/>)}
            </ul>
        </aside>
    )
}

export default SideBar;