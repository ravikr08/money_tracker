import { Link } from "react-router-dom";
import { ChartNoAxesCombined } from "lucide-react";

// the title is in the header of the app. the charts of this page are not built yet, the dashboard has the first ones
export default function AnalyticsPage() {
    return (
        <section aria-label="Analytics" className="flex flex-col items-center gap-3 px-6 py-16 text-center rounded-[22px] xl:rounded-3xl bg-white">
            <span className="size-16 grid place-items-center rounded-full bg-[#E6EAFF] text-[#2A3BC4]">
                <ChartNoAxesCombined size={30} strokeWidth={1.8} />
            </span>
            <span className="px-3 py-1 rounded-full bg-[#EEF3F1] type-caption font-semibold text-[#3C4C49]">Coming soon</span>
            <h2 className="type-section-title font-bold">Analytics is on its way</h2>
            <p className="max-w-[420px] type-body text-[#5A6B68]">
                Deeper charts, trends and reports of your income, expenses and savings will be here soon. Until then, the dashboard shows the main numbers.
            </p>
            <Link to="/" className="mt-2 h-11 inline-flex items-center px-5 rounded-full bg-[#3347E0] hover:bg-[#2A3BC4] type-body font-semibold text-white">
                Back to dashboard
            </Link>
        </section>
    )
}
