import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { MessageSquare, Lock, AlertCircle } from "lucide-react";
import { CommentItem } from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data as Comment[];
};

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) throw new Error("Authentication required");
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

  const {
    data: comments,
    isLoading,
    error: fetchError,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const {
    mutate,
    isPending,
    error: postError,
  } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata?.user_name || user?.email
      ),
    onSuccess: () => {
      setNewCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const buildCommentTree = (flatComments: Comment[]) => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];
    flatComments.forEach((c) => map.set(c.id, { ...c, children: [] }));
    flatComments.forEach((c) => {
      if (c.parent_comment_id) {
        map.get(c.parent_comment_id)?.children?.push(map.get(c.id)!);
      } else {
        roots.push(map.get(c.id)!);
      }
    });
    return roots;
  };

  if (isLoading)
    return (
      <div className="animate-pulse bg-white/5 h-20 w-full rounded-2xl mt-10" />
    );

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-10 w-full max-w-2xl mx-auto space-y-6 px-4 pb-20">
      <div className="flex items-center gap-2 text-pink-500 border-b border-white/5 pb-4">
        <MessageSquare size={20} />
        <h3 className="font-bold uppercase tracking-wider text-sm">
          Comments ({comments?.length || 0})
        </h3>
      </div>

      {user ? (
        <div className="flex gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="w-10 h-10 rounded-full bg-pink-600 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <span className="text-white font-bold">
                {user.user_metadata?.user_name?.[0] || user.email?.[0]}
              </span>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutate({ content: newCommentText });
            }}
            className="flex-1"
          >
            <textarea
              placeholder="What are your thoughts?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-500/50 transition-all resize-none text-sm"
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            {/* Display the postError if it exists */}
            {postError && (
              <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={14} />
                <span>{(postError as Error).message}</span>
              </div>
            )}
            <div className="flex justify-end mt-2">
              <button
                disabled={!newCommentText.trim() || isPending}
                className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-pink-500 disabled:opacity-50"
              >
                {isPending ? "POSTING..." : "POST COMMENT"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-3 text-center">
          <Lock className="text-gray-600" size={24} />
          <p className="text-gray-400 text-sm">
            Please sign in to participate in the discussion.
          </p>
        </div>
      )}

      {fetchError && (
        <div className="text-red-400 text-xs">Failed to load comments.</div>
      )}

      <div className="space-y-2">
        {commentTree.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
