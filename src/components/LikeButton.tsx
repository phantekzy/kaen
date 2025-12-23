import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

export const LikeButton = ({ postId }: { postId: number }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: votes } = useQuery({
    queryKey: ["votes", postId],
    queryFn: async () => {
      const { data } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId);
      return data || [];
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (val: number) => {
      if (!user) return;
      const { data: ex } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (ex) {
        ex.vote === val
          ? await supabase.from("votes").delete().eq("id", ex.id)
          : await supabase.from("votes").update({ vote: val }).eq("id", ex.id);
      } else {
        await supabase
          .from("votes")
          .insert({ post_id: postId, user_id: user.id, vote: val });
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["votes", postId] }),
  });

  const userVote = votes?.find((v: any) => v.user_id === user?.id);
  const likes = votes?.filter((v: any) => v.vote === 1).length || 0;
  const dislikes = votes?.filter((v: any) => v.vote === -1).length || 0;

  return (
    <div
      className={`flex items-center bg-zinc-900/50 border border-white/5 rounded-xl h-9 overflow-hidden ${
        isPending ? "opacity-50" : ""
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={() => mutate(1)}
        className={`flex items-center gap-2 px-4 h-full transition-all border-r border-white/5 ${
          userVote?.vote === 1
            ? "bg-pink-600 text-white"
            : "text-zinc-500 hover:text-white"
        }`}
      >
        <ThumbsUp
          size={14}
          className={userVote?.vote === 1 ? "fill-current" : ""}
        />
        <span className="text-[10px] font-bold">{likes}</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={() => mutate(-1)}
        className={`flex items-center gap-2 px-4 h-full transition-all ${
          userVote?.vote === -1
            ? "bg-white text-black"
            : "text-zinc-500 hover:text-white"
        }`}
      >
        <ThumbsDown
          size={14}
          className={userVote?.vote === -1 ? "fill-current" : ""}
        />
        <span className="text-[10px] font-bold">{dislikes}</span>
      </motion.button>
    </div>
  );
};
