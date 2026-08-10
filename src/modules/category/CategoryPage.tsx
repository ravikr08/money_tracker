import CategoryList from "./components/CategoryList";
import CategoryFilters from "./components/CategoryFilters";
import { Badge } from "@/shared/components/ui/badge";
import { AddCategoryDialogBox } from "./components/AddCategoryDialogBox";

const BADGES: { value: number; label: string; color: string }[] = [
    { value: 0, label: "categories total", color: "" },
    { value: 0, label: "active", color: "green" },
    { value: 0, label: "archived", color: "coral" },
    { value: 0, label: "default", color: "ink-soft" },
    { value: 0, label: "custom", color: "blue" },
];
export default function CategoryPage() {
    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex gap-3">
                {BADGES.map((badge) => (
                    <Badge
                        key={badge.label}
                        className={`bg-white text-slate px-3 py-2 rounded-full text-[12px] font-semibold flex items-baseline`}
                    >
                        <span className="flex items-center gap-1 mr-1">

                            {badge.color && (
                                <span
                                    className={`w-2 h-2 rounded-full mr-0.5`}
                                    style={{ backgroundColor: "var(--" + badge.color + ")" }}
                                ></span>
                            )}
                            <p className="font-bold text-[14px]">{badge.value}</p>
                        </span>
                        {badge.label}
                    </Badge>
                ))}
            </div>
            <CategoryFilters />
            <CategoryList />
            <AddCategoryDialogBox />
        </div>
    );
}
