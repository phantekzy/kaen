import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Reply, X } from "lucide-react";

interface Props {
  comment: Comment & { children?: Comment[] };
  postId: number;
}

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
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

  return (
    <div className="group/item">
      <div className="flex gap-3">
        {/* Avatar Column */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
            {comment.avatar_url ? (
              <img
                src={comment.avatar_url}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {comment.author[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="w-[1.5px] h-full bg-white/5 mt-2 mb-2 rounded-full" />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 pb-6">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.06] transition-all group/card">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-pink-400 text-xs font-bold">
                  {comment.author}
                </span>
                <span className="text-gray-600 text-[10px]">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              {user && (
                <button
                  onClick={() => setShowReply(!showReply)}
                  className="text-gray-500 hover:text-pink-400 p-1 transition-colors"
                >
                  {showReply ? <X size={14} /> : <Reply size={14} />}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed break-words">
              {comment.content}
            </p>
          </div>

          {showReply && user && (
            <div className="mt-3 flex gap-3 animate-in fade-in slide-in-from-left-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutate(replyText);
                }}
                className="flex-1"
              >
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
                    type="button"
                    onClick={() => setShowReply(false)}
                    className="text-gray-500 text-[10px] font-bold px-2 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    disabled={!replyText.trim() || isPending}
                    className="bg-pink-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold disabled:opacity-30"
                  >
                    {isPending ? "SENDING..." : "REPLY"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {comment.children && comment.children.length > 0 && (
            <div className="mt-4 space-y-1">
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
