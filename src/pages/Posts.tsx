// Import section
import { PostList } from "../components/PostList";

// Posts section
export const Posts = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-12">
          RECENT <span className="animate-shine-text">POSTS</span>
        </h2>

        <div className="relative">
          <PostList />
        </div>
      </div>
    </div>
  );
};
