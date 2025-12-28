import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Reply, X, Trash2, Pencil, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react";
import { UserBadge } from "./UserBadge";

interface Props {
    comment: Comment & { children?: Comment[] };
    postId: number;
    postAuthorId: string;
    depth?: number;
}

interface CommentVote { id: number; comment_id: number; user_id: string; vote: number; }

export const CommentItem = ({ comment, postId, postAuthorId, depth = 0 }: Props) => {
    const [showReply, setShowReply] = useState(false);
    const [showRepliesToggle, setShowRepliesToggle] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content);

    const { user } = useAuth();
    const queryClient = useQueryClient();

    // VOTING LOGIC
    const { data: votes } = useQuery<CommentVote[], Error>({
        queryKey: ["comment_votes", comment.id],
        queryFn: async () => {
            const { data, error } = await supabase.from("comment_votes").select("*").eq("comment_id", comment.id);
            if (error) throw new Error(error.message);
            return data as CommentVote[];
        },
    });

    const { mutate: toggleVote } = useMutation({
        mutationFn: async (voteValue: number) => {
            if (!user) return;
            const { data: existingVote } = await supabase.from("comment_votes").select("*").eq("comment_id", comment.id).eq("user_id", user.id).maybeSingle();
            if (existingVote) {
                if (existingVote.vote === voteValue) {
                    await supabase.from("comment_votes").delete().eq("id", existingVote.id);
                } else {
                    await supabase.from("comment_votes").update({ vote: voteValue }).eq("id", existingVote.id);
                }
            } else {
                await supabase.from("comment_votes").insert({ comment_id: comment.id, user_id: user.id, vote: voteValue });
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comment_votes", comment.id] }),
    });

    const likesCount = votes?.filter((v) => v.vote === 1).length || 0;
    const dislikesCount = votes?.filter((v) => v.vote === -1).length || 0;
    const userVote = votes?.find((v) => v.user_id === user?.id);

    // ACTIONS
    const { mutate: updateComment } = useMutation({
        mutationFn: async () => {
            await supabase.from("comments").update({ content: editText }).eq("id", comment.id);
        },
        onSuccess: () => { setIsEditing(false); queryClient.invalidateQueries({ queryKey: ["comments", postId] }); },
    });

    const { mutate: deleteComment } = useMutation({
        mutationFn: async () => { await supabase.from("comments").delete().eq("id", comment.id); },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
    });

    const { mutate: replyMutate, isPending: isReplyPending } = useMutation({
        mutationFn: async (content: string) => {
            await supabase.from("comments").insert({
                post_id: postId, content, parent_comment_id: comment.id,
                user_id: user?.id, author: user?.user_metadata?.user_name || user?.email,
                avatar_url: user?.user_metadata?.avatar_url,
            });
        },
        onSuccess: () => {
            setReplyText(""); setShowReply(false); setShowRepliesToggle(true);
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
    });

    return (
        <div className={`relative ${depth > 0 ? "ml-4 md:ml-8 mt-2" : "mt-8 border-t border-white/5 pt-6"}`}>

            {/* THREADING LINE */}
            {depth > 0 && (
                <div className="absolute left-[-14px] md:left-[-20px] top-0 bottom-0 w-[1.5px] bg-zinc-800" />
            )}

            <div className="flex flex-col">
                {/* RESPONSIVE HEADER */}
                <div className="flex items-center justify-between mb-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-800 shrink-0 border border-white/10 overflow-hidden">
                            {comment.avatar_url ? <img src={comment.avatar_url} className="w-full h-full object-cover" /> : <span className="text-white text-[10px] flex items-center justify-center h-full">{comment.author[0]}</span>}
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[12px] md:text-[13px] font-bold text-zinc-200 truncate">{comment.author}</span>
                            <UserBadge
                                userId={comment.user_id}
                                postAuthorId={postAuthorId}
                                communityOwnerId="YOUR_ADMIN_ID"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                        {user?.id === comment.user_id && (
                            <>
                                <button onClick={() => setIsEditing(!isEditing)} className="text-zinc-600 hover:text-white p-1">
                                    {isEditing ? <X size={14} /> : <Pencil size={13} />}
                                </button>
                                {isConfirmingDelete ? (
                                    <button onClick={() => deleteComment()} className="text-pink-500 text-[10px] font-bold px-2 py-0.5 bg-pink-500/10 rounded-md">Confirm?</button>
                                ) : (
                                    <button onClick={() => setIsConfirmingDelete(true)} className="text-zinc-600 hover:text-red-500 p-1"><Trash2 size={13} /></button>
                                )}
                            </>
                        )}
                        {user && (
                            <button onClick={() => setShowReply(!showReply)} className={`p-1 ${showReply ? "text-pink-500" : "text-zinc-600 hover:text-white"}`}>
                                {showReply ? <X size={14} /> : <Reply size={14} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* COMMENT BODY */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3 md:p-4">
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full bg-black/20 border border-pink-500/30 rounded-lg p-3 text-sm text-white outline-none" rows={2} />
                            <div className="flex justify-end gap-2"><button onClick={() => updateComment()} className="bg-pink-600 text-white px-3 py-1 rounded-md text-[10px] font-bold">SAVE</button></div>
                        </div>
                    ) : (
                        <>
                            <p className="text-[13px] md:text-[14px] text-zinc-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            <div className="flex items-center gap-3 mt-3">
                                <button onClick={() => toggleVote(1)} className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-[10px] font-bold ${userVote?.vote === 1 ? "bg-pink-600/20 text-pink-500" : "text-zinc-500 hover:text-pink-400"}`}>
                                    <ThumbsUp size={12} className={userVote?.vote === 1 ? "fill-current" : ""} /> {likesCount}
                                </button>
                                <button onClick={() => toggleVote(-1)} className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-[10px] font-bold ${userVote?.vote === -1 ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"}`}>
                                    <ThumbsDown size={12} className={userVote?.vote === -1 ? "fill-current" : ""} /> {dislikesCount}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* SHOW/HIDE REPLIES TOGGLE */}
                {comment.children && comment.children.length > 0 && (
                    <button onClick={() => setShowRepliesToggle(!showRepliesToggle)} className="flex items-center gap-2 mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-pink-500 w-fit">
                        {showRepliesToggle ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        {showRepliesToggle ? "Hide" : `Show ${comment.children.length} Replies`}
                    </button>
                )}

                {/* REPLY INPUT */}
                {showReply && (
                    <div className="mt-3 ml-2 border-l border-pink-500/20 pl-4">
                        <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Reply..." className="w-full bg-white/5 border border-pink-500/20 rounded-xl p-3 text-sm text-white outline-none" rows={2} />
                        <div className="flex justify-end mt-2">
                            <button onClick={() => replyMutate(replyText)} disabled={!replyText.trim() || isReplyPending} className="bg-pink-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase">REPLY</button>
                        </div>
                    </div>
                )}

                {/* RECURSIVE REPLIES */}
                {showRepliesToggle && comment.children && comment.children.map((child) => (
                    <CommentItem key={child.id} comment={child} postId={postId} postAuthorId={postAuthorId} depth={depth + 1} />
                ))}
            </div>
        </div>
    );
};
