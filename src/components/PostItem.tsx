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
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-pink-600 rounded-3xl opacity-0 group-hover:opacity-10 transition duration-500 blur-md" />

      <Link
        to={`/post/${post.id}`}
        className="relative flex flex-col sm:flex-row bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 transition-all duration-300 hover:border-white/30"
      >
        <div className="flex-1 text-left">
          <div className="flex items-start gap-4 text-left">
            {post.avatar_url ? (
              <img src={post.avatar_url} alt="avatar image"
               className="w-[35px] h-[35px] rounded-full object-cover"
               />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-rose-700 border border-white/10 shrink-0 shadow-lg" />
            )}
            <div className="text-left">
              <div className="text-lg md:text-xl font-bold text-white group-hover:text-pink-600 transition-colors duration-300 tracking-tight leading-snug line-clamp-2 text-left">
                {post.title}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-6 shrink-0 flex justify-start">
          <div className="relative w-full sm:w-40 md:w-48 aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black/50">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};
