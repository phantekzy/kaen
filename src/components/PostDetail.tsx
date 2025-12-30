import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageSquare,
    Plus,
    Minus,
    Trash2,
    Edit3,
    Check,
    X,
    Globe, // Added
} from "lucide-react";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { UserBadge } from "./UserBadge";

export const PostDetail = ({ postId, postAuthorId }: { postId: number; postAuthorId: string }) => {
    const [showComments, setShowComments] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: post, isLoading } = useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            const { data } = await supabase.from("posts").select("*").eq("id", postId).single();
            setEditTitle(data.title);
            setEditContent(data.content);
            return data;
        },
    });

    // --- Added Community Fetch ---
    const { data: community } = useQuery({
        queryKey: ["community", post?.community_id],
        enabled: !!post?.community_id,
        queryFn: async () => {
            const { data } = await supabase.from("communities").select("id, name").eq("id", post.community_id).single();
            return data;
        },
    });

    const updateMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from("posts")
                .update({ title: editTitle, content: editContent })
                .eq("id", postId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            setIsEditing(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.from("posts").delete().eq("id", postId);
            if (error) throw error;
        },
        onSuccess: () => {
            navigate("/posts");
        },
    });

    const isLong = (post?.content?.length || 0) > 400;
    const isOwner = user?.id === post?.user_id;

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-white/10 border-t-pink-600 rounded-full animate-spin" />
            </div>
        );

    return (
        <div className="flex flex-col gap-6">
            <motion.div layout className="relative bg-zinc-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                {isOwner && !isEditing && (
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        <AnimatePresence mode="wait">
                            {!isDeleting ? (
                                <motion.div key="actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                                    <button onClick={() => setIsEditing(true)} className="p-2 bg-black/50 hover:bg-white hover:text-black rounded-lg transition-all border border-white/10">
                                        <Edit3 size={14} />
                                    </button>
                                    <button onClick={() => setIsDeleting(true)} className="p-2 bg-black/50 hover:bg-red-600 rounded-lg transition-all border border-white/10">
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="flex items-center gap-2 bg-red-600 p-1 rounded-lg border border-red-500">
                                    <span className="text-[10px] font-bold px-2 text-white uppercase">Delete?</span>
                                    <button onClick={() => deleteMutation.mutate()} className="p-1.5 bg-white text-red-600 rounded hover:bg-black hover:text-white transition-all"><Check size={12} /></button>
                                    <button onClick={() => setIsDeleting(false)} className="p-1.5 bg-black/20 text-white rounded hover:bg-black transition-all"><X size={12} /></button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {post?.image_url && (
                    <div className="w-full bg-black/40 border-b border-white/5">
                        <img src={post.image_url} className="w-full h-auto max-h-[70vh] object-contain mx-auto" alt="" />
                    </div>
                )}

                <div className="p-6 md:p-10 space-y-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Title</label>
                                <input className="w-full bg-white/5 border border-white/10 p-4 text-3xl font-black text-white outline-none rounded-xl focus:border-pink-600 transition-colors" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Content</label>
                                <textarea className="w-full bg-white/5 border border-white/10 p-4 text-zinc-400 min-h-[250px] outline-none rounded-xl focus:border-pink-600 transition-colors resize-none" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button onClick={() => updateMutation.mutate()} className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all">Save</button>
                                <button onClick={() => setIsEditing(false)} className="bg-zinc-800 text-zinc-400 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <motion.h1 layout className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
                                {post?.title}
                            </motion.h1>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {/* Added Community Breadcrumb */}
                                    {community && (
                                        <>
                                            <button onClick={() => navigate(`/community/${community.id}`)} className="flex items-center gap-1 text-[10px] font-black text-pink-600 uppercase hover:text-white transition-colors">
                                                <Globe size={10} /> {community.name}
                                            </button>
                                            <span className="text-zinc-800 text-[10px]">/</span>
                                        </>
                                    )}
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-black tracking-widest">{post?.author}</span>
                                    <UserBadge userId={post?.user_id || ""} communityOwnerId="" postAuthorId={postAuthorId} />
                                </div>
                                <p className="text-zinc-500 font-mono text-[9px] uppercase">{post?.created_at ? new Date(post.created_at).toLocaleDateString() : ""}</p>
                            </div>

                            <div className="relative">
                                <motion.div animate={{ height: isExpanded ? "auto" : "4.5em" }} className="overflow-hidden">
                                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">{post?.content}</p>
                                </motion.div>
                                {isLong && (
                                    <button onClick={() => setIsExpanded(!isExpanded)} className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-pink-600 hover:text-white transition-colors">
                                        {isExpanded ? <Minus size={12} /> : <Plus size={12} />} {isExpanded ? "Show Less" : "Show More"}
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <LikeButton postId={postId} />
                    <motion.button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${showComments ? "bg-pink-600 border-pink-500 text-white" : "bg-zinc-900/50 border-white/10 text-zinc-500 hover:text-white"}`}>
                        <MessageSquare size={14} /> {showComments ? "Close Comments" : "View Comments"}
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {showComments && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="pb-20">
                        <CommentSection postId={postId} postAuthorId={postAuthorId} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
