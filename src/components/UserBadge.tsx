import { Shield, Crown, PenLine } from "lucide-react";

interface UserBadgeProps {
    userId: string;
    communityOwnerId: string;
    postAuthorId?: string;
    enableAuthorBadge?: boolean;
}

export const UserBadge = ({
    userId,
    communityOwnerId,
    postAuthorId,
    enableAuthorBadge = true,
}: UserBadgeProps) => {
    const SITE_FOUNDER_ID = "c7a74e65-2d15-47a4-9d38-25b5f2c54324";

    const isSiteFounder = userId === SITE_FOUNDER_ID;
    const isCommunityAdmin = userId === communityOwnerId;
    const isPostAuthor = enableAuthorBadge && postAuthorId && userId === postAuthorId;

    return (
        <div className="flex flex-wrap items-center gap-1 max-w-full">
            {isSiteFounder && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/50 rounded text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <Crown size={10} strokeWidth={3} />
                    <span className="hidden md:block text-[7px] font-black uppercase italic tracking-tighter">
                        Founder
                    </span>
                </div>
            )}

            {isCommunityAdmin && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-pink-600/10 border border-pink-600/50 rounded text-pink-600 shadow-[0_0_10px_rgba(219,39,119,0.1)]">
                    <Shield size={10} strokeWidth={3} />
                    <span className="hidden md:block text-[7px] font-black uppercase italic tracking-tighter">
                        Admin
                    </span>
                </div>
            )}

            {isPostAuthor && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-800 border border-white/10 rounded text-zinc-400">
                    <PenLine size={10} strokeWidth={3} />
                    <span className="hidden md:block text-[7px] font-black uppercase italic tracking-tighter">
                        Author
                    </span>
                </div>
            )}
        </div>
    );
};
