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
      await supabase.from("votes").delete().eq("id", existingVote.id);
    } else {
      await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
    }
  } else {
    await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
  }
};

export const LikeButton = ({ postId }: Props) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: votes, isLoading } = useQuery<Vote[]>({
    queryKey: ["votes", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId);
      return data || [];
    },
    refetchInterval: 5000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) throw new Error("You must be logged in");
      return vote(voteValue, postId, user.id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["votes", postId] }),
  });

  if (isLoading)
    return <div className="h-9 w-24 bg-white/5 rounded-xl animate-pulse" />;

  const likes = votes?.filter((v) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
  const userVote = votes?.find((v) => v.user_id === user?.id);

  return (
    <div
      className={`flex items-center bg-white/5 border border-white/10 rounded-xl h-9 overflow-hidden transition-opacity ${
        isPending ? "opacity-50" : ""
      }`}
    >
      {/* Compact Like */}
      <button
        onClick={() => mutate(1)}
        className={`flex items-center gap-1.5 px-3 h-full border-r border-white/5 transition-colors
          ${
            userVote?.vote === 1
              ? "bg-pink-600/20 text-pink-500"
              : "text-zinc-500 hover:text-white"
          }`}
      >
        <ThumbsUp
          size={14}
          className={userVote?.vote === 1 ? "fill-current" : ""}
        />
        <span className="text-[11px] font-bold">{likes}</span>
      </button>

      {/* Compact Dislike */}
      <button
        onClick={() => mutate(-1)}
        className={`flex items-center gap-1.5 px-3 h-full transition-colors
          ${
            userVote?.vote === -1
              ? "bg-white/10 text-white"
              : "text-zinc-500 hover:text-white"
          }`}
      >
        <ThumbsDown
          size={14}
          className={userVote?.vote === -1 ? "fill-current" : ""}
        />
        <span className="text-[11px] font-bold">{dislikes}</span>
      </button>
    </div>
  );
};
