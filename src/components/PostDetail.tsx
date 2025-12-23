import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Minus } from "lucide-react";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

export const PostDetail = ({ postId }: { postId: number }) => {
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: post } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();
      return data;
    },
  });

  // Function to handle the collapse and the scroll jump
  const handleToggle = () => {
    if (isExpanded) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsExpanded(!isExpanded);
  };

  const isLong = (post?.content?.length || 0) > 400;

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        layout
        className="bg-zinc-900/20 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl"
      >
        {post?.image_url && (
          <div className="w-full bg-black/40 border-b border-white/5">
            <img
              src={post.image_url}
              className="w-full h-auto max-h-[70vh] object-contain mx-auto"
              alt=""
            />
          </div>
        )}

        <div className="p-6 md:p-10 space-y-6">
          <motion.h1
            layout
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white"
          >
            {post?.title}
          </motion.h1>

          <div className="relative">
            <motion.div
              initial={false}
              animate={{ height: isExpanded ? "auto" : "4.5em" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                {post?.content}
              </p>
            </motion.div>

            {isLong && (
              <motion.button
                layout
                whileHover={{ x: 5 }}
                onClick={handleToggle} // Use the new toggle function here
                className="mt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-pink-600 hover:text-white transition-colors"
              >
                {isExpanded ? <Minus size={12} /> : <Plus size={12} />}
                {isExpanded ? "SHOW LESS" : "SHOW MORE"}
              </motion.button>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <LikeButton postId={postId} />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${
                showComments
                  ? "bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-600/20"
                  : "bg-zinc-900/50 border-white/10 text-zinc-500 hover:text-white"
              }`}
          >
            <MessageSquare size={14} />
            {showComments ? "CLOSE_COMMS" : "ACCESS_COMMS"}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="pb-20"
          >
            <CommentSection postId={postId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
