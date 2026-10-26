import { INITIAL, PROFILE } from "@/shared/utils/profile";

// the profile, at the bottom of the side menu. the header has it on the phone
// desktop: the avatar with the name and the email
export function SidebarUser() {
    return (
        <div className="mt-auto pb-5">
            <div className="pt-3 border-t border-[#E6E9F4] flex items-center gap-2">
                <span className="size-9 shrink-0 flex items-center justify-center rounded-full bg-(--avatar-bg-md) type-body font-bold text-white">{INITIAL}</span>
                <div className="min-w-0 flex flex-col">
                    <b className="type-body truncate">{PROFILE.name}</b>
                    <span className="type-caption text-slate truncate">{PROFILE.email}</span>
                </div>
            </div>
        </div>
    )
}

// tablet: the narrow icon menu, so only the avatar with the first name under it
export function RailUser() {
    return (
        <div className="mt-auto pb-4">
            <div className="pt-3 border-t border-[#E6E9F4] w-[60px] flex flex-col items-center gap-1" title={PROFILE.name}>
                <span className="size-10 flex items-center justify-center rounded-full bg-(--avatar-bg-md) type-body font-bold text-white">{INITIAL}</span>
                <span className="type-micro text-slate max-w-[84px] truncate">{PROFILE.name.split(" ")[0]}</span>
            </div>
        </div>
    )
}
