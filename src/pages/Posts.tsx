// Import section
import { PostList } from "../components/PostList";

// Posts section
export const Posts = () => {
  return (
    <div className="min-h-screen bg-black pt-16 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-10">
          RECENT <span className="animate-shine-text">POSTS</span>
        </h2>

        <div className="relative">
          <PostList />
        </div>
      </div>
    </div>
  );
};
