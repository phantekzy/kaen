import React, { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Reply, X } from "lucide-react";

interface Props {
  comment: Comment & { children?: Comment[] };
  postId: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) throw new Error("You must be logged in to reply!");
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentId,
    user_id: userId,
    author: author,
  });
  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (content: string) =>
      createReply(
        content,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name || user?.email
      ),
    onSuccess: () => {
      setReplyText("");
      setShowReply(false);
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    mutate(replyText);
  };

  return (
    <div className="relative group/item">
      <div className="flex gap-3">
        {/* Profile Pic  */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
            {user?.id === comment.user_id && user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                className="w-full h-full object-cover"
                alt="Author"
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {comment.author[0].toUpperCase()}
              </span>
            )}
          </div>
          {/* Thread Line  */}
          <div className="w-[1px] h-full bg-white/10 mt-2 mb-2" />
        </div>

        {/* Comment Content Column */}
        <div className="flex-1 min-w-0 pb-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.08] transition-all group/card">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-pink-400 text-xs font-bold">
                  {comment.author}
                </span>
                <span className="text-gray-500 text-[10px] font-medium">
                  • {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-gray-500 hover:text-pink-400 p-1 transition-colors"
              >
                {showReply ? <X size={14} /> : <Reply size={14} />}
              </button>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed break-words">
              {comment.content}
            </p>
          </div>

          {/* Reply Form Area */}
          {showReply && (
            <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-left-2">
              <div className="w-7 h-7 rounded-full bg-pink-600/20 border border-pink-500/30 flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    className="w-full h-full object-cover"
                    alt="Me"
                  />
                )}
              </div>
              <form onSubmit={handleReplySubmit} className="flex-1">
                <textarea
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full bg-white/5 border border-pink-500/20 rounded-xl p-3 text-sm text-white outline-none focus:border-pink-500/50 resize-none"
                  rows={2}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowReply(false)}
                    className="text-gray-500 text-[10px] font-bold px-2 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    disabled={!replyText.trim() || isPending}
                    className="bg-pink-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-pink-500 disabled:opacity-30"
                  >
                    {isPending ? "SENDING..." : "REPLY"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Render Nested Children */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-4 space-y-2">
              {comment.children.map((child) => (
                <CommentItem key={child.id} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
