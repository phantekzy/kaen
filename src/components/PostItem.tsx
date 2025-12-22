// Import section
import { Link } from "react-router";
import type { Post } from "./PostList";

// Props type
interface Props {
  post: Post;
}

// PostItem section
export const PostItem = ({ post }: Props) => {
  // Return section
  return (
    <div className="group relative">
      <Link
        to={`/post/${post.id}`}
        className="relative flex flex-col sm:flex-row gap-4 bg-[#1a1a1b] border border-[#343536] rounded-md p-4 transition-all duration-200 hover:border-[#474748] active:bg-[#272729] overflow-hidden"
      >
        {/* Left Side: Avatar and Content */}
        <div className="flex-1 min-w-0 flex gap-3 text-left">
          {/* Avatar Section */}
          <div className="shrink-0">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#343536]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-pink-600 border border-white/10 shrink-0 shadow-lg" />
            )}
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <p className="text-[#818384] text-[10px] font-bold uppercase tracking-widest">
              {new Date(post.created_at).toLocaleDateString()}
            </p>

            <h2 className="text-base md:text-xl font-bold text-[#d7dadc] group-hover:text-white transition-colors duration-200 tracking-tight leading-snug line-clamp-2 break-words">
              {post.title}
            </h2>

            {/* Content paragraph  */}
            <p className="text-[#818384] text-sm line-clamp-2 mt-1 break-words">
              {post.content}
            </p>
          </div>
        </div>

        {/* Right Side: Image Preview */}
        {post.image_url && (
          <div className="shrink-0 flex items-center justify-center sm:justify-end">
            <div className="relative w-full sm:w-32 md:w-40 aspect-video rounded-md overflow-hidden border border-[#343536] bg-black/50">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>
        )}
      </Link>
    </div>
  );
};
