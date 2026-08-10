import { Field, FieldGroup } from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import TabMenu from "@/shared/components/TabMenu";
import { type Dispatch, type SetStateAction } from "react";
import { AVAILABLE_CATEGORY_COLORS, AVAILABLE_CATEGORY_ICONS } from "../category.contansts";
import { cn } from "@/shared/lib/utils";
import type { DialogPayload, CategoryTypes } from "../category.model"

type propsType = {
    data: DialogPayload, setData: Dispatch<SetStateAction<DialogPayload>>
}
export default function AddCategoryDialogBoxFields({ data, setData }: propsType) {

    function handleColorChange(newColor: string) {
        setData((prev) => {
            if (prev.type === "category") {
                return {
                    ...prev,
                    data: { ...prev.data, color: newColor }
                }
            }
            return prev;
        })
    }
    function handleIconChange(newIcon: string) {
        setData((prev) => {
            if (prev.type === "category") {
                return {
                    ...prev,
                    data: { ...prev.data, icon: newIcon }
                }
            }
            return prev;
        })
    }
    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setData((prev) => {
            if (prev.type === "category") {
                return {
                    ...prev,
                    data: { ...prev.data, name: e.target.value }
                }
            }
            return {
                ...prev,
                data: { ...prev.data, name: e.target.value }
            }
        })
    }
    function handleCatTypeChange(newCatType: CategoryTypes) {
        setData((prev) => {
            if (prev.type === "category") {
                return {
                    ...prev,
                    data: { ...prev.data, type: newCatType }
                }
            }
            return prev;
        })
    }

    return (
        <FieldGroup>
            <Field>
                <Label className="text-slate">Name</Label>
                <Input disabled={(data?.type === "category" && data.data?.origin === "default")} aria-disabled={(data?.type === "category" && data.data?.origin === "default")} id="name-1" name="name" placeholder="e.g Food & Dining" className="rounded-sm shadow-none ring-0 focus-visible:ring-0 px-3 py-5 disabled:cursor-not-allowed aria-disabled:cursor-not-allowed" value={data.data?.name} onChange={handleNameChange} required={true} />
            </Field>
            {(data.type === "category") && <><Field>
                <Label className="text-slate">Transaction Type</Label>
                <TabMenu tabs={[{ value: "expense", label: "Expense" }, { value: "income", label: "Income" }]} selectedTab={data.data?.type} onTabChange={handleCatTypeChange} bgClass="bg-blue-soft rounded-sm w-full py-5.5" btnActiveClass="rounded-sm py-4" disabled={(data.type === "category" && data.data?.origin === "default")} />
            </Field>
                <Field>
                    <Label className="text-slate">Color</Label>
                    <div className="flex gap-2.5 flex-wrap">
                        {AVAILABLE_CATEGORY_COLORS.map(color => <button key={color} className={cn("flex items-center justify-center w-8 h-8 rounded-sm text-white cursor-pointer", data.data.color === color && "border-2 border-black")} style={{ background: color }} onClick={() => handleColorChange(color)}>{data.data.color === color && "✔"}</button>)}
                    </div>
                </Field>
                <Field>
                    <Label className="text-slate">Icons</Label>
                    <div className="flex gap-2.5 flex-wrap w-full h-35 overflow-y-scroll scroll">
                        {AVAILABLE_CATEGORY_ICONS.map(icon => <button key={icon} className={cn("flex items-center justify-center w-10 h-10 text-xl rounded-sm text-white cursor-pointer bg-blue-100", data.data.icon === icon && "border-2 border-[#8B7CF6]")} onClick={() => handleIconChange(icon)}>{icon}</button>)}
                    </div>
                </Field></>}
        </FieldGroup>
    )
}