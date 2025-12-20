// Import section
import { ThumbsUp, ThumbsDown } from "lucide-react";

// Props type
interface Props {
  postId: number;
}

// Like and dislike buttons
export const LikeButton = ({ postId }: Props) => {
  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 w-fit">
      {/* Like Button */}
      <button className="group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-pink-600/10 hover:text-pink-500 text-gray-400">
        <ThumbsUp
          size={18}
          className="group-hover:scale-110 group-active:scale-90 transition-transform"
        />
        <span className="text-sm font-bold tracking-tight">Like</span>
      </button>

      {/* Divider */}
      <div className="w-[1px] h-6 bg-white/10" />

      {/* Dislike Button */}
      <button className="group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:text-red-500 text-gray-400">
        <ThumbsDown
          size={18}
          className="group-hover:scale-110 group-active:scale-90 transition-transform"
        />
        <span className="text-sm font-bold tracking-tight">Dislike</span>
      </button>
    </div>
  );
};
