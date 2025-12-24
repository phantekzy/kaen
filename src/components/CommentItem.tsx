// Import section
import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import {
  Reply,
  X,
  Trash2,
  Pencil,
  Check,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// Types
interface Props {
  comment: Comment & { children?: Comment[] };
  postId: number;
  depth?: number;
}
// Comment votes types
interface CommentVote {
  id: number;
  comment_id: number;
  user_id: string;
  vote: number;
}
// Comment item section
export const CommentItem = ({ comment, postId, depth = 0 }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: votes } = useQuery<CommentVote[], Error>({
    queryKey: ["comment_votes", comment.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comment_votes")
        .select("*")
        .eq("comment_id", comment.id);
      if (error) throw new Error(error.message);
      return data as CommentVote[];
    },
    refetchInterval: 5000,
  });

  const { mutate: toggleVote, isPending: isVoting } = useMutation({
    mutationFn: async (voteValue: number) => {
      if (!user) throw new Error("You must be logged in");
      const { data: existingVote } = await supabase
        .from("comment_votes")
        .select("*")
        .eq("comment_id", comment.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (existingVote) {
        if (existingVote.vote === voteValue) {
          await supabase
            .from("comment_votes")
            .delete()
            .eq("id", existingVote.id);
        } else {
          await supabase
            .from("comment_votes")
            .update({ vote: voteValue })
            .eq("id", existingVote.id);
        }
      } else {
        await supabase.from("comment_votes").insert({
          comment_id: comment.id,
          user_id: user.id,
          vote: voteValue,
        });
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["comment_votes", comment.id],
      }),
  });

  const likesCount = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikesCount = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id);
  const isLiked = userVote?.vote === 1;
  const isDisliked = userVote?.vote === -1;

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("comments")
        .update({ content: editText })
        .eq("id", comment.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", comment.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const { mutate: replyMutate, isPending: isReplyPending } = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        content,
        parent_comment_id: comment.id,
        user_id: user?.id,
        author: user?.user_metadata?.user_name || user?.email,
        avatar_url: user?.user_metadata?.avatar_url,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setReplyText("");
      setShowReply(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const isOwner = user?.id === comment.user_id;

  return (
    <div
      className={`relative ${
        depth > 0 ? "ml-4 md:ml-7 mt-2" : "mt-8 border-t border-white/5 pt-6"
      }`}
    >
      {depth > 0 && (
        <div className="absolute left-[-16px] md:left-[-24px] top-0 bottom-0 w-[1px] bg-zinc-800 hover:bg-zinc-600 transition-colors" />
      )}

      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600/80 to-purple-600/80 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
              {comment.avatar_url ? (
                <img
                  src={comment.avatar_url}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <span className="text-white text-[10px] font-bold">
                  {comment.author[0].toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-[12px] font-bold text-pink-400">
              {comment.author}
            </span>
            <span className="text-zinc-600 text-[10px]">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isOwner && (
              <div className="flex items-center gap-1">
                {isEditing ? (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-zinc-500 hover:text-white p-1"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-zinc-600 hover:text-white p-1"
                  >
                    <Pencil size={13} />
                  </button>
                )}

                {isConfirmingDelete ? (
                  <div className="flex items-center gap-1 animate-in zoom-in duration-200">
                    <button
                      onClick={() => deleteComment()}
                      className="text-pink-500 text-[10px] font-bold uppercase px-2 py-1 bg-pink-500/10 rounded-md"
                    >
                      Confirm?
                    </button>
                    <button
                      onClick={() => setIsConfirmingDelete(false)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="text-zinc-600 hover:text-red-500 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            )}

            {user && (
              <button
                onClick={() => setShowReply(!showReply)}
                className={`p-1 transition-colors ${
                  showReply ? "text-pink-500" : "text-zinc-600 hover:text-white"
                }`}
              >
                {showReply ? <X size={14} /> : <Reply size={14} />}
              </button>
            )}
          </div>
        </div>

        <div
          className={`transition-all bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] ${
            isDeleting || isUpdating ? "opacity-30" : ""
          }`}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-black/20 border border-pink-500/30 rounded-lg p-3 text-sm text-white outline-none focus:border-pink-500"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-zinc-500 text-[10px] font-bold px-2"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => updateComment()}
                  className="bg-pink-600 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1"
                >
                  <Check size={12} /> {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-[14px] text-zinc-300 leading-relaxed break-words whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={!user || isVoting}
                    onClick={() => toggleVote(1)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all duration-300 ${
                      isLiked
                        ? "bg-pink-600/20 text-pink-500 border border-pink-500/30"
                        : "text-zinc-500 hover:text-pink-400 border border-transparent"
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      className={isLiked ? "fill-current" : ""}
                    />
                    <span className="text-[11px] font-bold">{likesCount}</span>
                  </button>

                  <button
                    disabled={!user || isVoting}
                    onClick={() => toggleVote(-1)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all duration-300 ${
                      isDisliked
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-zinc-500 hover:text-white border border-transparent"
                    }`}
                  >
                    <ThumbsDown
                      size={14}
                      className={isDisliked ? "fill-current" : ""}
                    />
                    <span className="text-[11px] font-bold">
                      {dislikesCount}
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Reply Form */}
        {showReply && (
          <div className="mt-3 ml-2 border-l border-pink-500/20 pl-4 animate-in fade-in slide-in-from-left-2">
            <textarea
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full bg-white/5 border border-pink-500/20 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500/50"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowReply(false)}
                className="text-zinc-500 text-[11px] font-bold px-3 hover:text-white flex items-center gap-1"
              >
                <X size={12} /> DISCARD
              </button>
              <button
                onClick={() => replyMutate(replyText)}
                disabled={!replyText.trim() || isReplyPending}
                className="bg-pink-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase"
              >
                {isReplyPending ? "Sending..." : "Reply"}
              </button>
            </div>
          </div>
        )}

        {/* Recursive Replies */}
        {comment.children && comment.children.length > 0 && (
          <div className="mt-4">
            {comment.children.map((child) => (
              <CommentItem
                key={child.id}
                comment={child}
                postId={postId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
