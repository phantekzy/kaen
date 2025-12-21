import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
  postId: number;
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId);
  if (error) throw new Error(error.message);
  return data as Vote[];
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: votes,
    isLoading,
    error,
  } = useQuery<Vote[], Error>({
    queryKey: ["votes", postId],
    queryFn: () => fetchVotes(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (isLoading)
    return <div className="animate-pulse bg-white/5 h-12 w-32 rounded-2xl" />;
  if (error)
    return <div className="text-red-500 text-xs">Error loading votes</div>;

  // Logic to check counts and user status
  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;

  // Find if the current user has voted
  const userVote = votes?.find((v) => v.user_id === user?.id);
  const isLiked = userVote?.vote === 1;
  const isDisliked = userVote?.vote === -1;

  return (
    <div
      className={`flex items-center gap-2 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 w-fit transition-opacity ${
        isPending ? "opacity-70" : "opacity-100"
      }`}
    >
      {/* Like Button */}
      <button
        disabled={isPending}
        className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 
          ${
            isLiked
              ? "bg-pink-600/20 text-pink-500"
              : "hover:bg-pink-600/10 hover:text-pink-500 text-gray-400"
          }`}
        onClick={() => mutate(1)}
      >
        <span className="text-sm font-bold">{likes}</span>
        <ThumbsUp
          size={18}
          className={`${
            isLiked ? "fill-current" : ""
          } group-hover:scale-110 transition-transform`}
        />
        <span className="text-sm font-medium">Like</span>
      </button>

      <div className="w-[1px] h-6 bg-white/10" />

      {/* Dislike Button */}
      <button
        disabled={isPending}
        className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 
          ${
            isDisliked
              ? "bg-white/20 text-red-500"
              : "hover:bg-white/10 hover:text-red-500 text-gray-400"
          }`}
        onClick={() => mutate(-1)}
      >
        <span className="text-sm font-bold">{dislikes}</span>
        <ThumbsDown
          size={18}
          className={`${
            isDisliked ? "fill-current" : ""
          } group-hover:scale-110 transition-transform`}
        />
        <span className="text-sm font-medium">Dislike</span>
      </button>
    </div>
  );
};
