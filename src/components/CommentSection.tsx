import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { MessageSquare } from "lucide-react";
import { CommentItem } from "./CommentItem";

interface Props {
    postId: number;
    postAuthorId: string;
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
    avatar_url?: string;
}

const fetchComments = async (postId: number): Promise<Comment[]> => {
    const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Comment[];
};

export const CommentSection = ({ postId, postAuthorId }: Props) => {
    const [newCommentText, setNewCommentText] = useState<string>("");
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: comments, isLoading } = useQuery<Comment[], Error>({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
        refetchInterval: 5000,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (newComment: NewComment) => {
            if (!user) throw new Error("Authentication required");
            const { error } = await supabase.from("comments").insert({
                post_id: postId,
                content: newComment.content,
                parent_comment_id: newComment.parent_comment_id || null,
                user_id: user.id,
                author: user.user_metadata?.user_name || user.email,
                avatar_url: user.user_metadata?.avatar_url,
            });
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            setNewCommentText("");
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
        },
    });

    const buildCommentTree = (flatComments: Comment[]) => {
        const map = new Map<number, Comment & { children?: Comment[] }>();
        const roots: (Comment & { children?: Comment[] })[] = [];

        flatComments.forEach((c) => map.set(c.id, { ...c, children: [] }));

        const sortedForTree = [...flatComments].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        sortedForTree.forEach((c) => {
            const node = map.get(c.id)!;
            if (c.parent_comment_id) {
                map.get(c.parent_comment_id)?.children?.push(node);
            }
        });

        flatComments.forEach((c) => {
            if (!c.parent_comment_id) {
                roots.push(map.get(c.id)!);
            }
        });

        return roots;
    };

    if (isLoading) return <div className="animate-pulse bg-white/5 h-24 w-full rounded-2xl mt-10" />;

    const commentTree = comments ? buildCommentTree(comments) : [];

    return (
        <div className="mt-10 w-full max-w-2xl mx-auto space-y-6 px-4 pb-20">
            {/* Header */}
            <div className="flex items-center gap-2 text-pink-500 border-b border-white/5 pb-4">
                <MessageSquare size={20} />
                <h3 className="font-bold uppercase tracking-wider text-sm">
                    Discussion ({comments?.length || 0})
                </h3>
            </div>

            {/* Input Form */}
            {user ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (newCommentText.trim()) mutate({ content: newCommentText });
                    }}
                >
                    <textarea
                        placeholder="What are your thoughts?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-500/50 transition-all text-sm resize-none"
                        rows={3}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            disabled={!newCommentText.trim() || isPending}
                            className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-pink-500 disabled:opacity-50 transition-all uppercase tracking-widest"
                        >
                            {isPending ? "Syncing..." : "Post Comment"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center text-gray-400 text-sm">
                    Please sign in to participate.
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {commentTree.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={postId}
                        postAuthorId={postAuthorId}
                    />
                ))}
            </div>
        </div>
    );
};
