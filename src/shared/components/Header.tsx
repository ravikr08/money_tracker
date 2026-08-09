import { Bell, Search } from "lucide-react"
import { useLocation } from "react-router-dom"

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
        <header className="w-full flex justify-between items-center">
            <div className="flex flex-col gap-1">

                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-slate text-sm">
                    {subtitle}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <span className="bg-white p-3.5 rounded-full cursor-pointer">
                    <Search size={18} />
                </span>
                <span className="bg-white p-3.5 rounded-full cursor-pointer">
                    <Bell size={18} />
                </span>
                <div className="flex items-center gap-2 bg-white pl-2 pr-5 py-1.5 rounded-full cursor-pointer">
                    <span className="bg-blue-500 w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ">
                        M
                    </span>
                    <div className="flex flex-col">
                        <h3 className="font-bold text-sm">Madan Gowda</h3>
                        <p className="text-sm text-slate">
                            madangowda@gmail.com
                        </p>
                    </div>
                </div>
            </div>
        </header>
    )
}