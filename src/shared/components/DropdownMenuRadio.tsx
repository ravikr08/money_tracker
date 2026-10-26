import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger, DropdownMenuRadioGroup } from "@/shared/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
export default function DropdownMenuRadio<T>({
    options,
    selected,
    onValChange
}: {
    options: { value: string; label: string }[];
    selected: string;
    onValChange: (value: T) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={(isOpen) => { setOpen(isOpen) }}>
            <DropdownMenuTrigger
                render={
                    <button className="bg-white rounded-full h-11 w-full justify-between px-4 md:rounded-lg md:h-auto md:w-auto md:justify-start md:px-4.5 py-2 type-body text-slate font-semibold flex items-center gap-2 cursor-pointer" onClick={e => e.stopPropagation()}>
                        {selected && options.find((o) => o.value === selected)?.label}
                        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                }
            />
            <DropdownMenuContent className="p-2">
                <DropdownMenuRadioGroup value={selected} onValueChange={(value) => { onValChange(value); setOpen(false) }} onClick={e => e.stopPropagation()}>
                    {options.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                            {option.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
