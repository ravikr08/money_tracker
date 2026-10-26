import { useLocation } from "react-router-dom"
import { FIRST_NAME, INITIAL } from "@/shared/utils/profile"

const pages: { [key: string]: { title: string; subtitle: string } } = {
    "": {
        title: "Dashboard",
        subtitle: `Hi ${FIRST_NAME}, here's your money at a glance.`
    },
    "category": {
        title: "Categories",
        subtitle: "Create, organise, and maintain the categories used across your transactions."
    },
    "accounts": {
        title: "Accounts",
        subtitle: "Manage your financial accounts and their details."
    },
    "analytics": {
        title: "Analytics",
        subtitle: "Gain insights into your financial performance and trends."
    },
    "transactions": {
        title: "Transactions",
        subtitle: "View and manage your financial transactions."
    },
};

// the title and the subtitle of the page. the profile avatar is here on the phone only,
// on the tablet and the desktop it is at the bottom of the side menu (SidebarUser)
export default function Header() {
    const location = useLocation();
    const pageKey = location.pathname.replace("/", "");
    const { title, subtitle } = pages[pageKey] || { title: "Dashboard", subtitle: "Overview of your financial activities." };

    return (
        <header className="w-full grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
            <h1 className="type-page-title font-bold min-w-0 col-start-1">{title}</h1>
            <p className="type-body text-slate col-[1/-1]">
                {subtitle}
            </p>
            <span aria-label="Profile" className="md:hidden bg-(--avatar-bg) size-11 shrink-0 col-start-2 row-start-1 flex items-center justify-center rounded-full type-body text-white font-semibold">
                {INITIAL}
            </span>
        </header>
    )
}
