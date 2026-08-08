import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import DashboardPage from "@/modules/dashboard/DashboardPage";
import AccountsPage from "@/modules/accounts/AccountsPage";
import AnalyticsPage from "@/modules/analytics/AnalyticsPage"
import SettingsPage from "@/modules/settings/SettingsPage"
import TransactionPage from "@/modules/transactions/TransactionsPage"
import CategoryPage from "@/modules/category/CategoryPage";

export const Router = createBrowserRouter([
    {
        element: <App/>,
        children: [
            {
                index: true,
                element: <DashboardPage/>
            },
            {
                path: "accounts",
                element: <AccountsPage/>
            },
            {
                path: "analytics",
                element: <AnalyticsPage/>
            },
            {
                path: "settings",
                element: <SettingsPage/>
            },
            {
                path: "transactions",
                element: <TransactionPage/>
            },
            {
                path: "category",
                element: <CategoryPage/>
            }
        ]
    }
]);