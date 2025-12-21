/* Import section */
import { CreatePost } from "../components/CreatePost";

/* Create post page */
export const CreatePostPage = () => {
  return (
    <div className="bg-black min-h-screen pt-10 pb-20 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-pink-600/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full">
        {/* Header Section  */}
        <div className="flex flex-col items-center mb-8 px-6">
          <div className="flex flex-col items-center w-full">
            <h1 className="text-4xl sm:text-7xl md:text-9xl font-black text-center text-white tracking-tighter leading-tight">
              Draft your
            </h1>
            <h1 className="text-pink-600 text-4xl sm:text-7xl md:text-9xl font-black text-center tracking-tighter leading-tight">
              expertise
            </h1>
          </div>

          <div className="mt-4 flex items-center gap-2 w-full justify-center">
            <div className="hidden sm:block h-[1px] w-8 bg-pink-600/50" />
            <p className="text-gray-500 text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] text-center">
              High-signal technical exchange starts here
            </p>
            <div className="hidden sm:block h-[1px] w-8 bg-pink-600/50" />
          </div>
        </div>

        {/* The Form Component */}
        <CreatePost />
      </div>
    </div>
  );
};
