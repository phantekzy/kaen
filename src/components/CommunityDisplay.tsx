import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { LikeButton } from "./LikeButton";
import {
    Loader2, X, Send, MessageCircle, Trash2, Edit3,
    ChevronDown, ChevronUp, ArrowLeft, Plus,
    Minus, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserBadge } from "./UserBadge";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

/* Types */
interface Props {
    communityId: number;
    communityOwnerId?: string;
}

const CommentLikeButton = ({ commentId }: { commentId: number }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: votes } = useQuery({
        queryKey: ["comment_votes", commentId],
        queryFn: async () => {
            const { data } = await supabase.from("comment_votes").select("*").eq("comment_id", commentId);
            return data || [];
        }
    });

    const { mutate: handleVote, isPending } = useMutation({
        mutationFn: async (voteValue: number) => {
            if (!user) return;
            const { data: existing } = await supabase
                .from("comment_votes")
                .select("*")
                .eq("comment_id", commentId)
                .eq("user_id", user.id)
                .maybeSingle();

            if (existing) {
                if (existing.vote === voteValue) {
                    await supabase.from("comment_votes").delete().eq("id", existing.id);
                } else {
                    await supabase.from("comment_votes").update({ vote: voteValue }).eq("id", existing.id);
                }
            } else {
                await supabase.from("comment_votes").insert({
                    comment_id: commentId,
                    user_id: user.id,
                    vote: voteValue
                });
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comment_votes", commentId] })
    });

    const likes = votes?.filter((v: any) => v.vote === 1).length || 0;
    const dislikes = votes?.filter((v: any) => v.vote === -1).length || 0;
    const userVote = votes?.find((v: any) => v.user_id === user?.id);

    return (
        <div className={`flex items-center bg-white/5 border border-white/10 rounded-lg h-7 overflow-hidden transition-opacity ${isPending ? "opacity-50" : ""}`}>
            <button onClick={() => handleVote(1)} className={`flex items-center gap-1 px-2 h-full border-r border-white/5 transition-colors ${userVote?.vote === 1 ? "text-pink-500 bg-pink-500/10" : "text-zinc-600 hover:text-white"}`}>
                <ThumbsUp size={10} className={userVote?.vote === 1 ? "fill-current" : ""} />
                <span className="text-[9px] font-bold">{likes}</span>
            </button>
            <button onClick={() => handleVote(-1)} className={`flex items-center gap-1 px-2 h-full transition-colors ${userVote?.vote === -1 ? "text-white bg-white/10" : "text-zinc-600 hover:text-white"}`}>
                <ThumbsDown size={10} className={userVote?.vote === -1 ? "fill-current" : ""} />
                <span className="text-[9px] font-bold">{dislikes}</span>
            </button>
        </div>
    );
};

const RecursiveComment = ({ comment, currentUserId, communityOwnerId, postAuthorId, onReply, onRefresh, onError }: any) => {
    const [showReplies, setShowReplies] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [editText, setEditText] = useState(comment.content);
    const isOwner = currentUserId === comment.user_id;

    const handleDelete = async () => {
        const { error } = await supabase.from("comments").delete().eq("id", comment.id);
        if (error) onError(error.message);
        else onRefresh();
    };

    const handleUpdate = async () => {
        const { error } = await supabase.from("comments").update({ content: editText }).eq("id", comment.id);
        if (error) onError(error.message);
        else { setIsEditing(false); onRefresh(); }
    };

    return (
        <div className="group flex gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-zinc-900 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                {comment.avatar_url ? (
                    <img src={comment.avatar_url} className="w-full h-full object-cover" alt="" />
                ) : (
                    <span className="text-[9px] md:text-[10px] font-black text-pink-600">{comment.author?.[0]}</span>
                )}
            </div>
            <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter truncate">{comment.author}</span>
                        <UserBadge userId={comment.user_id} communityOwnerId={communityOwnerId} postAuthorId={postAuthorId} />
                    </div>
                    {isOwner && (
                        <div className="flex gap-2 items-center shrink-0">
                            <button onClick={() => setIsEditing(!isEditing)} className="text-zinc-600 hover:text-white">
                                {isEditing ? <X size={12} className="text-pink-500" /> : <Edit3 size={12} />}
                            </button>
                            {isConfirmingDelete ? (
                                <button onClick={handleDelete} className="text-red-500 text-[9px] font-black uppercase">Confirm?</button>
                            ) : (
                                !isEditing && <button onClick={() => setIsConfirmingDelete(true)} className="text-zinc-600 hover:text-red-500"><Trash2 size={12} /></button>
                            )}
                        </div>
                    )}
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-3 md:p-4 rounded-2xl rounded-tl-none">
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs text-white outline-none resize-none" rows={2} />
                            <div className="flex gap-3">
                                <button onClick={handleUpdate} className="text-[9px] font-bold text-pink-600 uppercase">Save</button>
                                <button onClick={() => setIsEditing(false)} className="text-[9px] font-bold text-zinc-600 uppercase">Cancel</button>
                            </div>
                        </div>
                    ) : <p className="text-zinc-300 text-[12px] md:text-[13px] leading-relaxed break-words">{comment.content}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {currentUserId && <button onClick={() => onReply(comment)} className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-pink-600">Reply</button>}
                        {comment.children?.length > 0 && (
                            <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-pink-600">
                                {showReplies ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                {comment.children.length} {comment.children.length === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>
                    <CommentLikeButton commentId={comment.id} />
                </div>

                <AnimatePresence>
                    {showReplies && comment.children?.length > 0 && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 border-l border-white/5 ml-1 md:ml-2 pl-3 md:pl-4 space-y-6">
                                {comment.children.map((child: any) => (
                                    <RecursiveComment key={child.id} comment={child} currentUserId={currentUserId} communityOwnerId={communityOwnerId} postAuthorId={postAuthorId} onReply={onReply} onRefresh={onRefresh} onError={onError} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export const CommunityDisplay = ({ communityId, communityOwnerId }: Props) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState<any>(null);
    const [notification, setNotification] = useState<{ msg: string, type: 'error' | 'success' } | null>(null);
    const [descExpanded, setDescExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    useEffect(() => {
        if (selectedPostId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedPostId]);

    const showToast = (msg: string, type: 'error' | 'success' = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const { data: community } = useQuery({
        queryKey: ["community-meta", communityId],
        queryFn: async () => {
            const { data } = await supabase.from("communities").select("*").eq("id", communityId).single();
            return data;
        }
    });

    const { data: posts, isLoading } = useQuery({
        queryKey: ["communityPost", communityId],
        queryFn: async () => {
            const { data } = await supabase.from("posts").select("*").eq("community_id", communityId).order("created_at", { ascending: false });
            return data || [];
        },
    });

    const activePost = posts?.find(p => p.id === selectedPostId);
    const totalPosts = posts?.length || 0;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const currentPosts = posts?.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const { data: allComments, refetch: refetchComments, isLoading: isLoadingComments } = useQuery({
        queryKey: ["drawer-comments", selectedPostId],
        enabled: !!selectedPostId,
        queryFn: async () => {
            const { data, error } = await supabase.from("comments").select("*").eq("post_id", selectedPostId).order("created_at", { ascending: true });
            if (error) throw error;
            return data || [];
        }
    });

    const buildCommentTree = (flatComments: any[]) => {
        const map = new Map();
        const roots: any[] = [];
        flatComments.forEach((c) => map.set(c.id, { ...c, children: [] }));
        flatComments.forEach((c) => {
            const node = map.get(c.id);
            if (c.parent_comment_id) map.get(c.parent_comment_id)?.children?.push(node);
            else roots.push(node);
        });
        return roots;
    };

    const commentTree = allComments ? buildCommentTree(allComments) : [];

    const { mutate: handleSendComment, isPending: isSending } = useMutation({
        mutationFn: async () => {
            if (!user || !commentText.trim() || !selectedPostId) return;
            const { error } = await supabase.from("comments").insert({
                post_id: selectedPostId,
                content: commentText.trim(),
                parent_comment_id: replyingTo?.id || null,
                user_id: user.id,
                author: user.user_metadata?.full_name || user.user_metadata?.user_name || user.email?.split('@')[0],
                avatar_url: user.user_metadata?.avatar_url
            });
            if (error) throw error;
        },
        onSuccess: () => {
            setCommentText(""); setReplyingTo(null); refetchComments();
        },
        onError: (err: any) => showToast(err.message, 'error')
    });

    if (isLoading) return <div className="py-40 text-center"><Loader2 className="animate-spin inline text-pink-600" /></div>;

    const communityName = community?.name || "Loading";
    const [firstWord, ...rest] = communityName.split(" ");
    const restOfName = rest.join(" ");

    return (
        <div className="w-full pb-32 relative overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 pt-6 relative z-50">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <header className="mb-12 md:mb-20 mt-8 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8]">
                                {firstWord}<br />
                                <span className="text-zinc-800 italic">{restOfName}</span>
                            </h1>
                            {community?.description && (
                                <div className="mt-6 md:mt-8 max-w-2xl">
                                    <motion.div animate={{ height: (community.description.length > 150 && !descExpanded) ? "3.2em" : "auto" }} className="overflow-hidden">
                                        <p className="text-zinc-500 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] leading-relaxed">{community.description}</p>
                                    </motion.div>
                                    {community.description.length > 150 && (
                                        <button onClick={() => setDescExpanded(!descExpanded)} className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-pink-600">
                                            {descExpanded ? <Minus size={10} /> : <Plus size={10} />} {descExpanded ? "Show Less" : "Show More"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-4">
                            <button onClick={() => navigate('/create-post')} className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-pink-600 transition-all group">
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">New Post</span>
                                <Plus size={14} className="text-pink-600 group-hover:text-white" />
                            </button>
                            <div className="flex flex-col items-start md:items-end">
                                <span className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.4em]">Entries</span>
                                <span className="text-5xl md:text-7xl font-mono text-white tracking-tighter leading-none">{totalPosts.toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {currentPosts?.map((post) => (
                        <div key={post.id} className="group flex flex-col bg-zinc-900/20 border border-white/5 p-4 rounded-[28px] transition-all hover:bg-zinc-900/40">
                            <PostItem post={post} variant="grid" onOpenComments={(id) => setSelectedPostId(id)} />
                            <button onClick={() => setSelectedPostId(post.id)} className="mt-6 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-pink-600 transition-all rounded-2xl border border-white/5 text-[10px] font-black uppercase text-zinc-500 hover:text-white">
                                <MessageCircle size={14} /> View Comments
                            </button>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="mt-16 md:mt-20 flex justify-center items-center gap-3 md:gap-4">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-zinc-500 hover:text-white disabled:opacity-0 transition-all"><ChevronLeft size={20} /></button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-8 h-8 rounded-lg text-[10px] font-black border ${currentPage === i + 1 ? "bg-pink-600 border-pink-500 text-white" : "text-zinc-500 bg-white/5 border-white/5"}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-zinc-500 hover:text-white disabled:opacity-0 transition-all"><ChevronRight size={20} /></button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedPostId && activePost && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex flex-col lg:flex-row bg-black/95 backdrop-blur-xl">
                        {/* LEFT: POST (Desktop Only) */}
                        <div className="hidden lg:flex flex-1 relative flex-col overflow-y-auto p-12">
                            <button onClick={() => setSelectedPostId(null)} className="absolute top-10 left-10 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white border border-white/10">
                                <X size={20} />
                            </button>
                            <div className="max-w-3xl mx-auto w-full space-y-10">
                                {activePost.image_url && <img src={activePost.image_url} className="w-full h-auto rounded-3xl border border-white/5" alt="" />}
                                <div className="space-y-6">
                                    <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-tight">{activePost.title}</h1>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-600 uppercase">Author</span>
                                            <span className="text-xl font-black text-pink-600 uppercase italic">{activePost.author}</span>
                                        </div>
                                        <LikeButton postId={activePost.id} />
                                    </div>
                                    <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap">{activePost.content}</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: COMMENTS (Full screen Mobile) */}
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 250 }} className="w-full lg:w-[480px] bg-zinc-950 border-l border-white/10 flex flex-col h-full shadow-2xl ml-auto relative">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/50 sticky top-0 z-20">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white font-black uppercase text-[10px] tracking-widest">Post Discussion</span>
                                    <span className="lg:hidden text-zinc-500 text-[9px] uppercase font-bold truncate pr-4">{activePost.title}</span>
                                </div>
                                <button onClick={() => setSelectedPostId(null)} className="p-2 text-zinc-500 hover:text-white bg-white/5 rounded-full shrink-0"><X size={18} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-8 overscroll-contain">
                                {isLoadingComments ? (
                                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-600" /></div>
                                ) : commentTree.length > 0 ? (
                                    commentTree.map(comment => (
                                        <RecursiveComment
                                            key={comment.id}
                                            comment={comment}
                                            currentUserId={user?.id}
                                            communityOwnerId={communityOwnerId || community?.owner_id}
                                            postAuthorId={activePost.user_id}
                                            onReply={(c: any) => setReplyingTo(c)}
                                            onRefresh={refetchComments}
                                            onError={(msg: string) => showToast(msg, 'error')}
                                        />
                                    ))
                                ) : (
                                    /* EMPTY STATE ICON */
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                        <div className="p-5 bg-white/5 rounded-full mb-4 relative">
                                            <MessageCircle size={32} className="text-zinc-800" />
                                            <Plus size={16} className="text-pink-600 absolute -bottom-1 -right-1" />
                                        </div>
                                        <h3 className="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-1">No Comments </h3>
                                        <p className="text-zinc-600 text-[9px] uppercase tracking-tighter max-w-[180px]">Be the first to initialize the discussion protocol.</p>
                                    </motion.div>
                                )}
                            </div>

                            <div className="p-4 bg-zinc-900 border-t border-white/10 shrink-0 pb-10 lg:pb-4">
                                {!user ? (
                                    <button onClick={() => navigate('/auth')} className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 text-zinc-500 hover:text-white transition-all">
                                        <span className="text-[10px] font-black uppercase italic">Login to comment</span>
                                    </button>
                                ) : (
                                    <>
                                        {replyingTo && <div className="mb-2 flex justify-between items-center bg-pink-600/10 p-2 rounded-lg border border-pink-500/20"><span className="text-[9px] text-pink-500 font-bold uppercase">Replying to {replyingTo.author}</span><button onClick={() => setReplyingTo(null)} className="text-zinc-500"><X size={12} /></button></div>}
                                        <div className="flex items-center gap-2">
                                            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendComment()} placeholder="Add to thread..." className="flex-1 bg-black border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:border-pink-600 outline-none" />
                                            <button onClick={() => handleSendComment()} disabled={isSending || !commentText.trim()} className="bg-pink-600 text-white p-4 rounded-2xl disabled:opacity-20 active:scale-90 transition-all shadow-lg shadow-pink-600/20">
                                                {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-2xl ${notification.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-pink-600 text-white border-pink-500'}`}>
                        {notification.msg}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
