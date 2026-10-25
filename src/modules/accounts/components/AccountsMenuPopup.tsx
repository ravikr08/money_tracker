
import { DrawerTrigger } from "@/shared/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Archive, Ellipsis, Eye, PencilLine, RotateCcw } from "lucide-react";
import { ACCOUNTS_DIALOG_HANLDE, ACCOUNTS_DRAWER_HANDLE } from "../accounts.constants";
import { DialogTrigger } from "@/shared/components/ui/dialog";
import { accountsServices } from "../accounts.services";
import type { AccountsKind } from "../accounts.model";

type AccountsMenuPopupProps = {
    id: string;
    type: AccountsKind;
    isActive: boolean;
}

export default function AccountsMenuPopup({ id, type, isActive }: AccountsMenuPopupProps) {
    function handleStatusChange() {
        const status = isActive ? "archived" : "active";
        if (type === "account") {
            accountsServices.setAccountStatus(id, status);
        } else {
            accountsServices.setCreditCardStatus(id, status);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<button className="opacity-50 hover:opacity-100 cursor-pointer"><Ellipsis size={20} /></button>} onClick={e => { e.stopPropagation() }} />
            <DropdownMenuContent className="w-fit p-1.5 bg-white flex flex-col rounded-sm ring-0" >
                <DropdownMenuItem className={"p-0"} onClick={e => e.stopPropagation()}>
                    <DrawerTrigger handle={ACCOUNTS_DRAWER_HANDLE} payload={{ id, type }} className={"flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-blue-soft rounded-[7px] w-full"}>
                        <Eye /> View Details
                    </DrawerTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem className={"p-0"} onClick={e => e.stopPropagation()}>
                    <DialogTrigger handle={ACCOUNTS_DIALOG_HANLDE} className={"flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-blue-soft rounded-[7px] w-full"} payload={{ mode: "edit", type, id }}>
                        <PencilLine /> Edit
                    </DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem className={"p-0"} onClick={e => { e.stopPropagation(); handleStatusChange(); }}>
                    <span className="flex items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-blue-soft rounded-[7px] w-full">
                        {isActive ? <><Archive /> Archive</> : <><RotateCcw /> Restore</>}
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
