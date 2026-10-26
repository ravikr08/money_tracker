import { LayoutDashboard, ArrowLeftRight, Wallet, ChartNoAxesCombined, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Page = {
    path : string,
    icon : LucideIcon;
    label : string;
}

// used by the sidebar (desktop), the icon rail (tablet) and the bottom nav (phone)
export const pages: Page[] = [
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
    }];
