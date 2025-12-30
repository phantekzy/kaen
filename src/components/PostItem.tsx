import { type Post } from "./PostList";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { Trash2, AlertTriangle, X, Check, Heart, MessageSquare, Globe } from "lucide-react";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserBadge } from "./UserBadge";

interface PostItemProps {
    post: Post & { community_id?: number };
    variant: "list" | "grid";
    onOpenComments?: (id: number) => void;
}

export const PostItem = ({ post, variant, onOpenComments }: PostItemProps) => {
    const isList = variant === "list";
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const queryClient = useQueryClient();

    const springTransition = { type: "spring", stiffness: 400, damping: 40, mass: 1 } as const;

    // --- FETCH COMMUNITY DATA ---
    const { data: community } = useQuery({
        queryKey: ["community", post.community_id],
        enabled: !!post.community_id,
        queryFn: async () => {
            const { data } = await supabase
                .from("communities")
                .select("id, name")
                .eq("id", post.community_id)
                .single();
            return data;
        },
    });

    const { data: votes = [] } = useQuery({
        queryKey: ["votes", post.id],
        queryFn: async () => {
            const { data } = await supabase.from("votes").select("*").eq("post_id", post.id);
            return data || [];
        },
        refetchInterval: 5000
    });

    const { data: commentsCount = 0 } = useQuery({
        queryKey: ["comments-count", post.id],
        queryFn: async () => {
            const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", post.id);
            return count || 0;
        },
        refetchInterval: 5000
    });

    const likesCount = votes.filter((v: any) => v.vote === 1).length;
    const isLiked = votes.some((v: any) => v.user_id === currentUserId);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getUser();
            setCurrentUserId(data.user?.id || null);
        };
        getSession();
    }, []);

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUserId) return;

        if (isLiked) {
            await supabase.from("votes").delete().eq("post_id", post.id).eq("user_id", currentUserId);
        } else {
            await supabase.from("votes").insert({ post_id: post.id, user_id: currentUserId, vote: 1 });
        }
        queryClient.invalidateQueries({ queryKey: ["votes", post.id] });
    };

    const handleDelete = async () => {
        const { error } = await supabase.from("posts").delete().eq("id", post.id);
        if (!error) window.location.reload();
    };

    return (
        <motion.div layout transition={springTransition} className="group relative h-full w-full">
            <AnimatePresence>
                {isConfirming && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center p-4 border border-red-500/40"
                    >
                        <div className="p-3 bg-red-500/10 rounded-full mb-4">
                            <AlertTriangle className="text-red-500" size={20} />
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsConfirming(false); }}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 text-[10px] uppercase font-bold border border-white/5 whitespace-nowrap transition-colors hover:text-white"
                            >
                                <X size={12} /> Abort
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 rounded-lg text-red-500 text-[10px] uppercase font-bold border border-red-500/50 whitespace-nowrap hover:bg-red-600 hover:text-white transition-all"
                            >
                                <Check size={12} /> Execute
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Link to={`/post/${post.id}`} className="block h-full">
                <motion.div
                    layout
                    transition={springTransition}
                    className={`bg-zinc-900/30 border border-white/5 overflow-hidden rounded-2xl h-full backdrop-blur-sm
                        ${isList ? "flex flex-col md:flex-row p-3 md:p-4 gap-4 md:gap-6 items-start md:items-center" : "flex flex-col"}`}
                >
                    {post.image_url && (
                        <div className={`${isList ? "w-full md:w-56 shrink-0" : "w-full"} aspect-video overflow-hidden rounded-xl bg-black/20`}>
                            <motion.img
                                layout
                                src={post.image_url}
                                className="w-full h-full block object-cover"
                                transition={springTransition}
                            />
                        </div>
                    )}

                    <div className="flex-1 w-full flex flex-col py-1">
                        <div className="flex flex-wrap items-center justify-between gap-y-3 mb-3 px-3 md:px-4">
                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                                {community && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate(`/community/${community.id}`);
                                        }}
                                        className="flex items-center gap-1.5 px-2 py-0.5 bg-pink-600/10 border border-pink-500/20 rounded-md group/comm shrink-0"
                                    >
                                        <Globe size={10} className="text-pink-500" />
                                        <span className="text-[9px] font-black text-pink-500 uppercase tracking-tighter group-hover/comm:text-white transition-colors">
                                            {community.name}
                                        </span>
                                    </button>
                                )}

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-black truncate max-w-[100px]">
                                        {post.author}
                                    </span>
                                    <UserBadge userId={post.user_id} communityOwnerId="" postAuthorId={post.user_id} enableAuthorBadge={false} />
                                </div>
                            </div>

                            {currentUserId === post.user_id && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsConfirming(true); }}
                                    className="text-zinc-600 hover:text-red-500 transition-colors ml-auto"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        <div className="px-3 md:px-4">
                            <h3 className="text-white font-bold text-base md:text-lg uppercase tracking-tighter mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                                {post.content}
                            </p>
                        </div>

                        <div className="mt-auto flex gap-4 pt-4 pb-2 px-3 md:px-4 border-t border-white/5 font-mono text-[10px] text-zinc-500">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-pink-500" : "hover:text-pink-500"}`}
                            >
                                <Heart size={12} className={isLiked ? "fill-pink-500" : ""} />
                                {likesCount}
                            </button>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onOpenComments?.(post.id);
                                }}
                                className="flex items-center gap-1.5 hover:text-white transition-colors"
                            >
                                <MessageSquare size={12} />
                                {commentsCount}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
};
