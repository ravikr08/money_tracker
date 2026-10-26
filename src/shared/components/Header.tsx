import { Bell, Search } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const pages: { [key: string]: { title: string; subtitle: string } } = {
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
    "settings": {
        title: "Settings",
        subtitle: "Customize your experience and manage your preferences."
    },
    "transactions": {
        title: "Transactions",
        subtitle: "View and manage your financial transactions."
    },
};

export default function Header() {
    const location = useLocation();
    const pageKey = location.pathname.replace("/", "");
    // console.log(location.pathname, pages[pageKey]);
    const { title, subtitle } = pages[pageKey] || { title: "Dashboard", subtitle: "Overview of your financial activities." };

    return (
        // phone: title and icons in one row, subtitle below
        // tablet and desktop: title and subtitle on the left, icons on the right
        <header className="w-full grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5">
            <h1 className="type-page-title font-bold min-w-0 col-start-1">{title}</h1>
            <p className="type-body text-slate col-[1/-1] md:col-[1] md:max-w-[340px] lg:max-w-none">
                {subtitle}
            </p>
            <div className="flex items-center gap-2 shrink-0 col-start-2 row-start-1 md:row-span-2">
                <span className="bg-white size-11 grid place-items-center md:size-auto md:block md:p-3.5 rounded-full cursor-pointer">
                    <Search className="size-5 md:size-[18px]" />
                </span>
                <span className="bg-white size-11 grid place-items-center md:size-auto md:block md:p-3.5 rounded-full cursor-pointer">
                    <Bell className="size-5 md:size-[18px]" />
                </span>
                <Link to="/settings" className="flex items-center gap-2 md:bg-white md:pl-2 md:pr-5 md:py-1.5 rounded-full cursor-pointer">
                    <span className="bg-(--avatar-bg) md:bg-(--avatar-bg-md) size-11 md:size-10 flex items-center justify-center rounded-full type-body text-white font-semibold md:font-bold ">
                        M
                    </span>
                    <div className="hidden md:flex flex-col">
                        <h3 className="font-bold type-body">Madan Gowda</h3>
                        <p className="hidden lg:block type-body text-slate">
                            madangowda@gmail.com
                        </p>
                    </div>
                </Link>
            </div>
        </header>
    )
}
