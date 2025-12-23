import { type Post } from "./PostList";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { Trash2, AlertTriangle, X, Check } from "lucide-react";
import { supabase } from "../supabase-client";
import { useEffect, useState } from "react";

interface PostItemProps {
  post: Post;
  variant: "list" | "grid";
}

export const PostItem = ({ post, variant }: PostItemProps) => {
  const isList = variant === "list";
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Fetch the current session user to check ownership
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    getSession();
  }, []);

  const isOwner = currentUserId === post.user_id;

  const handleDelete = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (!error) {
      window.location.reload();
    }
  };

  return (
    <motion.div layout className="group relative">
      {/* KAEN SYSTEM CONFIRMATION OVERLAY */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-red-500/50"
          >
            <AlertTriangle className="text-red-500 mb-2" size={24} />
            <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.3em] mb-4 text-red-500">
              Confirm_Deletion
            </h4>
            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsConfirming(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 rounded text-zinc-400 font-mono text-[10px] uppercase hover:text-white transition-colors"
              >
                <X size={12} /> Abort
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/50 rounded text-red-500 font-mono text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <Check size={12} /> Execute
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to={`/post/${post.id}`} className="block h-full">
        <motion.div
          layout
          className={`bg-zinc-900/40 border border-white/5 overflow-hidden transition-all hover:border-pink-500/30
            ${
              isList
                ? "flex flex-col md:flex-row gap-6 p-4 rounded-xl items-center"
                : "flex flex-col rounded-2xl h-full"
            }`}
        >
          {/* IMAGE SECTION */}
          {post.image_url && (
            <motion.div
              layout
              className={`relative overflow-hidden bg-black flex items-center justify-center shrink-0
                ${
                  isList
                    ? "w-full md:w-44 h-32 md:h-28 rounded-lg"
                    : "w-full h-56 md:h-64"
                }`}
            >
              <img
                src={post.image_url}
                className="w-full h-full object-contain"
                alt=""
              />
            </motion.div>
          )}

          {/* CONTENT SECTION */}
          <div
            className={`flex flex-col flex-1 w-full ${
              !isList ? "p-6" : "py-2"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="text-zinc-800">/</span>
                <span className="text-[9px] font-mono text-pink-600 uppercase font-bold">
                  {post.author}
                </span>
              </div>

              {/* DELETE TOOLd */}
              {isOwner && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsConfirming(true);
                  }}
                  className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <h3 className="font-bold text-white text-lg leading-tight mb-2 uppercase tracking-tight">
              {post.title}
            </h3>

            <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-light">
              {post.content}
            </p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
