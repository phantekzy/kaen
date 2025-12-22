import { useState } from "react";
import { Link } from "react-router";
import type { Post } from "./PostList";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Trash2, X } from "lucide-react";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConfirming, setIsConfirming] = useState(false);

  const isOwner = user?.id === post.user_id;

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <div className="group relative">
      {isOwner && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {isConfirming ? (
            <div className="flex items-center gap-1 animate-in zoom-in duration-200 bg-[#1a1a1b] border border-pink-500/30 p-1 rounded-lg shadow-xl">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deletePost();
                }}
                disabled={isDeleting}
                className="text-pink-500 text-[10px] font-bold uppercase px-2 py-1 hover:bg-pink-500/10 rounded-md transition-colors"
              >
                {isDeleting ? "Deleting..." : "Confirm?"}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsConfirming(false);
                }}
                className="text-gray-500 hover:text-white p-1"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsConfirming(true);
              }}
              className="p-2 bg-black/60 hover:bg-red-600/20 text-gray-400 hover:text-red-500 rounded-full border border-white/5 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      <Link
        to={`/post/${post.id}`}
        className="relative flex flex-col sm:flex-row gap-4 bg-[#1a1a1b] border border-[#343536] rounded-md p-4 transition-all duration-200 hover:border-[#474748] active:bg-[#272729] overflow-hidden"
      >
        <div className="flex-1 min-w-0 flex gap-3 text-left">
          <div className="shrink-0">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                className="w-8 h-8 rounded-full object-cover border border-[#343536]"
                alt=""
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-600 border border-white/10 shrink-0" />
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <p className="text-[#818384] text-[10px] font-bold uppercase">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <h2 className="text-base md:text-xl font-bold text-[#d7dadc] group-hover:text-white transition-colors">
              {post.title}
            </h2>
            <p className="text-[#818384] text-sm line-clamp-2 mt-1">
              {post.content}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
