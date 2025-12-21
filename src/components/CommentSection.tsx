// Import section
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { MessageSquare, Send, AlertCircle } from "lucide-react";

// Types
interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

// Create comments function
const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to comment!");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // useMutation - FIXED SYNTAX (added commas)
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name || user?.email // Fallback name
      ),
    onSuccess: () => {
      setNewCommentText("");
      // Refresh the comments list
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (err: any) => {
      console.error("Comment Error:", err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    mutate({
      content: newCommentText,
      parent_comment_id: null,
    });
  };

  return (
    <div className="mt-10 w-full max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-pink-500 mb-2">
        <MessageSquare size={20} />
        <h3 className="font-bold uppercase tracking-wider text-sm">Comments</h3>
      </div>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="group relative bg-white/5 border border-white/10 rounded-2xl p-4 transition-all focus-within:border-pink-500/50 focus-within:bg-white/[0.08]"
        >
          <textarea
            placeholder="Write a comment..."
            rows={3}
            className="w-full bg-transparent border-none outline-none text-white placeholder-gray-500 resize-none py-2 text-sm"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />

          <div className="flex items-center justify-between mt-2 border-t border-white/5 pt-3">
            <span className="text-[10px] text-gray-500 uppercase font-medium">
              Posting as{" "}
              <span className="text-pink-400">
                {user?.user_metadata?.user_name || "User"}
              </span>
            </span>

            <button
              type="submit"
              disabled={!newCommentText.trim() || isPending}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs transition-all
                ${
                  !newCommentText.trim() || isPending
                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-pink-600 text-white hover:bg-pink-500 hover:scale-105 active:scale-95 shadow-lg shadow-pink-600/20"
                }`}
            >
              {isPending ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={14} />
              )}
              {isPending ? "POSTING..." : "POST COMMENT"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white/5 border border-dashed border-white/20 p-8 rounded-2xl text-center">
          <p className="text-gray-400 text-sm">
            Please{" "}
            <span className="text-pink-500 font-semibold cursor-pointer">
              Log In
            </span>{" "}
            to join the discussion.
          </p>
        </div>
      )}

      {/* Error Message UI */}
      {isError && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-xs">
          <AlertCircle size={14} />
          <span>Error: {(error as any).message}</span>
        </div>
      )}
    </div>
  );
};
