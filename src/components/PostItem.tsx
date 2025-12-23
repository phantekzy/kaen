import { useState } from "react";
import { Link } from "react-router";
import type { Post } from "./PostList";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Trash2, X, Calendar, User, ArrowUpRight } from "lucide-react";

interface Props {
  post: Post;
  variant?: "list" | "grid";
}

export const PostItem = ({ post, variant = "list" }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConfirming, setIsConfirming] = useState(false);

  const isOwner = user?.id === post.user_id;
  const isGrid = variant === "grid";

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
    <div className="group relative h-full">
      {/* Overlays */}
      {isOwner && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {isConfirming ? (
            <div className="flex items-center gap-1 animate-in slide-in-from-right-4 bg-black border border-pink-500/50 p-1.5 rounded-xl shadow-2xl">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deletePost();
                }}
                disabled={isDeleting}
                className="text-pink-500 text-[10px] font-black uppercase px-3 py-1.5 hover:bg-pink-500/10 rounded-lg transition-colors"
              >
                {isDeleting ? "WIPING..." : "CONFIRM?"}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsConfirming(false);
                }}
                className="text-zinc-500 hover:text-white p-1.5"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsConfirming(true);
              }}
              className="p-2.5 bg-black/80 hover:bg-red-950/40 text-zinc-500 hover:text-red-500 rounded-xl border border-white/5 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}

      <Link
        to={`/post/${post.id}`}
        className={`
          flex h-full bg-[#0a0a0b] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 
          hover:border-pink-500/40 hover:shadow-[0_0_50px_-12px_rgba(219,39,119,0.3)]
          ${isGrid ? "flex-col" : "flex-col sm:flex-row p-6 gap-8"}
        `}
      >
        {/* Media Block */}
        {post.image_url && (
          <div
            className={`
            shrink-0 overflow-hidden relative
            ${
              isGrid
                ? "w-full h-56 border-b border-white/5"
                : "sm:w-64 sm:h-44 w-full h-48 rounded-2xl border border-white/5"
            }
          `}
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
              <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                View Post <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        )}

        {/* Content Block */}
        <div
          className={`flex flex-col flex-1 ${
            isGrid ? "p-8" : "min-w-0 justify-center py-2"
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-pink-600/10 border border-pink-500/20 text-pink-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-md">
                POST
              </span>
              <span className="text-zinc-700 text-[10px] font-mono tracking-tighter">
                POST_ // {post.id}
              </span>
            </div>

            <h2
              className={`font-black text-white tracking-tighter leading-[1.1] group-hover:text-pink-500 transition-colors ${
                isGrid ? "text-2xl mb-3" : "text-3xl mb-3"
              }`}
            >
              {post.title}
            </h2>

            <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-medium mb-6">
              {post.content}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center border border-white/10 overflow-hidden">
                {post.avatar_url ? (
                  <img
                    src={post.avatar_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={12} className="text-zinc-600" />
                )}
              </div>
              <span className="text-zinc-300 text-xs font-black tracking-tight uppercase italic">
                @{post.author || "kaen_user"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-600">
              <Calendar size={14} />
              <span className="text-[10px] font-mono uppercase tracking-widest">
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
