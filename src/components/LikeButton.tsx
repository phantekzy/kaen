// Import section
import { useMutation } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

// Props type
interface Props {
  postId: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { error } = await supabase
    .from("votes")
    .insert({ post_id: postId, user_id: userId, vote: voteValue });
  if (error) throw new Error(error.message);

};

// Like and dislike buttons
export const LikeButton = ({ postId }: Props) => {
  //   Get user id
  const { user } = useAuth();
  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) {
        throw new Error("You must be logged in to like or dislike the posts");
      }
      return vote(voteValue, postId, user!.id);
    },
  });
  return (
    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 w-fit">
      {/* Like Button */}
      <button
        className="group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-pink-600/10 hover:text-pink-500 text-gray-400"
        onClick={() => mutate(1)}
      >
        <ThumbsUp
          size={18}
          className="group-hover:scale-110 group-active:scale-90 transition-transform"
        />
        <span className="text-sm font-bold tracking-tight">Like</span>
      </button>

      {/* Divider */}
      <div className="w-[1px] h-6 bg-white/10" />

      {/* Dislike Button */}
      <button
        className="group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10 hover:text-red-500 text-gray-400"
        onClick={() => mutate(-1)}
      >
        <ThumbsDown
          size={18}
          className="group-hover:scale-110 group-active:scale-90 transition-transform"
        />
        <span className="text-sm font-bold tracking-tight">Dislike</span>
      </button>
    </div>
  );
};
