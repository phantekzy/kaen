import { type Post } from "./PostList";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Trash2, AlertTriangle, X, Check, Heart, MessageSquare } from "lucide-react";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserBadge } from "./UserBadge";

interface PostItemProps {
    post: Post;
    variant: "list" | "grid";
}

export const PostItem = ({ post, variant }: PostItemProps) => {
    const isList = variant === "list";
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);

    const springTransition = { type: "spring", stiffness: 400, damping: 40, mass: 1 } as const;

    const { data: votes = [] } = useQuery({
        queryKey: ["votes", post.id],
        queryFn: async () => {
            const { data } = await supabase.from("votes").select("*").eq("post_id", post.id);
            return data || [];
        },
    });

    const { data: commentsCount = 0 } = useQuery({
        queryKey: ["comments-count", post.id],
        queryFn: async () => {
            const { count } = await supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", post.id);
            return count || 0;
        },
    });

    const likesCount = votes.filter((v: any) => v.vote === 1).length;

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getUser();
            setCurrentUserId(data.user?.id || null);
        };
        getSession();
    }, []);

    const handleDelete = async () => {
        const { error } = await supabase.from("posts").delete().eq("id", post.id);
        if (!error) window.location.reload();
    };

    return (
        <motion.div layout transition={springTransition} className="group relative h-full w-full">
            {/* DELETE OVERLAY */}
            <AnimatePresence>
                {isConfirming && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center p-4 border border-red-500/40"
                    >
                        {/* ICON AT TOP */}
                        <div className="p-3 bg-red-500/10 rounded-full mb-4">
                            <AlertTriangle className="text-red-500" size={20} />
                        </div>

                        {/* BUTTONS IN ONE LINE */}
                        <div className="flex flex-row items-center gap-2">
                            <button
                                onClick={(e) => { e.preventDefault(); setIsConfirming(false); }}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg text-zinc-400 text-[10px] uppercase font-bold border border-white/5 whitespace-nowrap transition-colors hover:text-white"
                            >
                                <X size={12} /> Abort
                            </button>

                            <button
                                onClick={(e) => { e.preventDefault(); handleDelete(); }}
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
                        ${isList ? "flex flex-col md:flex-row p-4 gap-6 items-center" : "flex flex-col"}`}
                >
                    {/* IMAGE */}
                    {post.image_url && (
                        <div className={`${isList ? "w-full md:w-56 shrink-0" : "w-full"} overflow-hidden rounded-xl bg-black/20`}>
                            <motion.img
                                layout
                                src={post.image_url}
                                className="w-full h-auto block object-contain"
                                transition={springTransition}
                            />
                        </div>
                    )}

                    <div className="flex-1 w-full flex flex-col py-2">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-pink-600 uppercase font-black">{post.author}</span>
                                <UserBadge userId={post.user_id} communityOwnerId="" postAuthorId={post.user_id} enableAuthorBadge={false} />
                            </div>

                            {currentUserId === post.user_id && (
                                <button
                                    onClick={(e) => { e.preventDefault(); setIsConfirming(true); }}
                                    className="text-zinc-600 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>

                        <h3 className="text-white font-bold text-lg uppercase tracking-tighter mb-2 group-hover:text-pink-500 transition-colors">
                            {post.title}
                        </h3>

                        <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                            {post.content}
                        </p>

                        <div className="mt-auto flex gap-4 pt-3 border-t border-white/5 font-mono text-[10px] text-zinc-500">
                            <span className="flex items-center gap-1">
                                <Heart size={12} className="text-pink-600 fill-pink-600" />
                                {likesCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageSquare size={12} />
                                {commentsCount}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    );
};
