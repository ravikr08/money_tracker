import {cn} from '@/shared/lib/utils'
import type { Page } from './SideBar';
import { NavLink } from 'react-router-dom';
export type ListProps = Page & {
    isActive : boolean;
}

function SidebarList({icon:Icon, label, path, isActive}: ListProps){


    return(
        <li className = {"flex w-full justify-start items-center px-2.5" } >
            <NavLink to={path} className={cn("flex w-full items-center rounded-md relative gap-2 px-3 py-2 text-gray-500", isActive && "bg-blue-soft text-blue font-semibold")}>
            <span><Icon size={18}/></span>
            <span>{label}</span>
            <span className={cn("absolute right-0 top-0 rounded-r-lg flex bg-blue h-full w-2", !isActive && "bg-white")}></span>
            </NavLink>
        </li>
    )
}

export default SidebarList;