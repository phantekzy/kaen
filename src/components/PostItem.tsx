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

  // Added 'as const' to fix the TypeScript build errors
  const springTransition = {
    type: "spring",
    stiffness: 400,
    damping: 40,
    mass: 1,
  } as const;

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
    <motion.div
      layout
      transition={springTransition}
      className="group relative h-full"
    >
      {/* KAEN SYSTEM DELETE OVERLAY */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.1)]"
          >
            <div className="p-3 bg-red-500/10 rounded-full mb-4">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h4 className="text-white font-mono text-[10px] uppercase tracking-[0.4em] mb-1">
              Warning
            </h4>
            <p className="text-zinc-500 text-[10px] font-mono uppercase mb-6">
              Irreversible_Action
            </p>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsConfirming(false);
                }}
                className="flex items-center gap-2 px-5 py-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-400 font-mono text-[10px] uppercase hover:text-white hover:bg-zinc-800 transition-all"
              >
                <X size={12} /> Abort
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                className="flex items-center gap-2 px-5 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-500 font-mono text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all"
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
          transition={springTransition}
          className={`bg-zinc-900/30 border border-white/5 overflow-hidden rounded-2xl h-full backdrop-blur-sm
            ${
              isList ? "flex flex-row gap-6 p-4 items-center" : "flex flex-col"
            }`}
        >
          {/* IMAGE SECTION */}
          {post.image_url && (
            <motion.div
              layout
              transition={springTransition}
              className={`relative overflow-hidden bg-black/50 flex items-center justify-center shrink-0
                ${
                  isList
                    ? "w-32 h-32 md:w-56 md:h-36 rounded-xl"
                    : "w-full h-64 md:h-72"
                }`}
            >
              <motion.img
                layout
                transition={springTransition}
                src={post.image_url}
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}

          {/* CONTENT SECTION */}
          <motion.div
            layout
            transition={springTransition}
            className={`flex flex-col flex-1 w-full ${
              !isList ? "p-8" : "py-2 pr-4"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="text-[10px] font-mono text-pink-600 uppercase font-bold tracking-tighter">
                  {post.author}
                </span>
              </div>

              {isOwner && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsConfirming(true);
                  }}
                  className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <motion.h3
              layout
              transition={springTransition}
              className="font-bold text-white text-xl md:text-2xl mb-3 tracking-tighter uppercase leading-tight group-hover:text-pink-500 transition-colors"
            >
              {post.title}
            </motion.h3>

            <motion.p
              layout
              transition={springTransition}
              className="text-zinc-500 text-sm line-clamp-2 leading-relaxed font-light"
            >
              {post.content}
            </motion.p>
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
