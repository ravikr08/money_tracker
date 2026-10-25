import {cn} from '@/shared/lib/utils'
import type { Page } from './sidebar.constants';
import { NavLink } from 'react-router-dom';
export type ListProps = Page & {
    isActive : boolean;
}

function SidebarList({icon:Icon, label, path, isActive}: ListProps){


    return(
        <li className = {"flex w-full justify-start items-center" } >
            <NavLink to={path} className={cn("flex w-full items-center rounded-[10px] gap-3 px-3 py-2.5 text-[14px] font-medium text-[#586079] hover:bg-bg", isActive && "bg-(--nav-active-bg) text-(--nav-active-fg) font-semibold hover:bg-(--nav-active-bg)")}>
            <Icon size={18} strokeWidth={1.8}/>
            <span>{label}</span>
            </NavLink>
        </li>
    )
}

export default SidebarList;
