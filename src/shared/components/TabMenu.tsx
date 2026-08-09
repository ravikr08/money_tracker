import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { cn } from "../lib/utils";

export default function TabMenu<T>({ tabs, selectedTab, onTabChange, bgClass, btnActiveClass, disabled }: { tabs: { value: string; label: string }[], selectedTab: string, onTabChange: (tab: T) => void, bgClass?: string, btnActiveClass?: string, disabled?: boolean }) {
    return (
        <Tabs value={selectedTab} onValueChange={onTabChange} aria-disabled={disabled}>
            <TabsList className={cn("rounded-xl bg-white py-5 aria-disabled:cursor-not-allowed", bgClass)} aria-disabled={disabled}>
                {tabs.map((tab) => (
                    <TabsTrigger aria-disabled={disabled} key={tab.value} value={tab.value} className={cn("px-6 py-4 rounded-xl cursor-pointer data-active:bg-black data-active:text-white data-active:hover:text-white", btnActiveClass)}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs >
    )
}