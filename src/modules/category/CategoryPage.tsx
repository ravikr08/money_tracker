import CategoryList from "./components/CategoryList";
import CategoryFilters from "./components/CategoryFilters";
import { Badge } from "@/shared/components/ui/badge";
import { CategoryDialogBox } from "./components/CategoryDialogBox";
import { SubcategoryDialogBox } from "./components/SubcategoryDialogBox";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { Category } from "./category.model";

const BADGES: { value: number; label: string; color: string }[] = [
    { value: 0, label: "category total", color: "" },
    { value: 0, label: "active", color: "green" },
    { value: 0, label: "archived", color: "coral" },
];
export default function CategoryPage() {
    const [selected, setSeleted] = useState<string[]>([]);
    const categories: Category[] = useSelector(state => state.categorySlice.categories)
    BADGES.forEach(el => {
        if (el.label === "category total") {
            el.value = categories.filter(cat => cat.status !== "deleted").length;
        } else {
            el.value = categories.filter((cat: Category) => cat.status.trim().toLowerCase() === el.label.trim().toLowerCase()).length;
        }
    })
    return (
        <div className="w-full h-full flex flex-col gap-4 xl:gap-5">
            <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
                {BADGES.map((badge) => (
                    <Badge
                        key={badge.label}
                        className={`bg-white text-slate px-2.5 md:px-3 py-2 rounded-full type-caption font-semibold flex items-baseline shrink-0 whitespace-nowrap`}
                    >
                        <span className="flex items-center gap-1 mr-1">

                            {badge.color && (
                                <span
                                    className={`w-2 h-2 rounded-full mr-0.5`}
                                    style={{ backgroundColor: "var(--" + badge.color + ")" }}
                                ></span>
                            )}
                            <p className="font-bold type-body">{badge.value}</p>
                        </span>
                        {badge.label}
                    </Badge>
                ))}
            </div>
            <CategoryFilters selected={selected} setSelected={setSeleted} />
            <CategoryList setSelected={setSeleted} selected={selected} />
            <CategoryDialogBox />
            <SubcategoryDialogBox />
        </div>
    );
}
