// Import section
import { Link } from "react-router";
import type { Post } from "./PostList";

// Props type
interface Props {
  post: Post;
}

// PostItem section
export const PostItem = ({ post }: Props) => {
//   Return section
  return (
    <div className="group relative h-full">
      {/* Pink Glow on Hover */}
      <div className="absolute -inset-0.5 bg-pink-600 rounded-[2rem] opacity-0 group-hover:opacity-15 transition duration-500 blur-lg" />

      <Link
        to={`/post/${post.id}`}
        className="relative h-full flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/30 shadow-2xl"
      >
        <div className="p-6">
          {/* Header : avatar and title */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-700 border border-white/10 shrink-0 shadow-lg" />
            <div>
              <div className="text-xl font-bold text-white group-hover:text-pink-600 transition-colors duration-300 tracking-tight leading-snug line-clamp-2">
                {post.title}
              </div>
            </div>
          </div>
        </div>

        {/* Image section */}
        <div className="px-6 pb-6 mt-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/50">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
