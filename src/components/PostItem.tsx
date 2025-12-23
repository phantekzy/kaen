import { type Post } from "./PostList";
import { motion } from "framer-motion";
import { Link } from "react-router";

interface PostItemProps {
  post: Post;
  variant: "list" | "grid";
}

export const PostItem = ({ post, variant }: PostItemProps) => {
  const isList = variant === "list";

  return (
    <Link to={`/post/${post.id}`} className="block h-full">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`group relative bg-zinc-900/40 border border-white/5 overflow-hidden transition-colors hover:bg-zinc-900/60 hover:border-pink-500/20
          ${
            isList
              ? "flex flex-col md:flex-row gap-6 p-4 rounded-xl items-center"
              : "flex flex-col rounded-2xl h-full"
          }`}
      >
        {/* IMAGE */}
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
            <motion.img
              layout
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-contain"
            />
          </motion.div>
        )}

        {/* CONTENT */}
        <motion.div
          layout
          className={`flex flex-col flex-1 w-full ${!isList ? "p-6" : "py-2"}`}
        >
          <motion.div layout className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
            <span className="text-[10px] text-zinc-700">—</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              {post.author}
            </span>
          </motion.div>

          <motion.h3
            layout
            className={`font-bold text-white leading-tight mb-2 group-hover:text-pink-400 transition-colors
            ${isList ? "text-lg md:text-xl" : "text-xl md:text-2xl"}`}
          >
            {post.title}
          </motion.h3>

          <motion.p
            layout
            className="text-zinc-400 text-sm line-clamp-2 leading-relaxed"
          >
            {post.content}
          </motion.p>
        </motion.div>
      </motion.div>
    </Link>
  );
};
