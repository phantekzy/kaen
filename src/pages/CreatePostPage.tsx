/* Import section */
import { CreatePost } from "../components/CreatePost";
/* Create post page */
export const CreatePostPage = () => {
  return (
    <div className="bg-black min-h-screen pt-3 ">
      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold text-center text-white tracking-tight">
          Draft your
        </h1>
        <h1 className="text-pink-600 text-5xl sm:text-7xl md:text-8xl font-extrabold text-center whitespace-nowrap tracking-tight">
          expertise
        </h1>
        <p className="text-gray-400 text-sm sm:text-lg font-medium pt-4">
          High-signal technical exchange starts here.
        </p>
      </div>
      <CreatePost />
    </div>
  );
};
